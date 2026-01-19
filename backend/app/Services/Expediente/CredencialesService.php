<?php

namespace App\Services\Expediente;

use App\Repositories\ExpedienteRepository;
use App\Repositories\Solicitud\SolicitudParteRepository;
use App\Repositories\Solicitud\SolicitudCorreoRepository;
use App\Repositories\AsuntoRepository;
use App\Repositories\UsuarioExpedienteRepository;
use App\Services\MensajeService;
use App\DTOs\Mensajes\CrearMensajeDTO;
use Exception;
use Illuminate\Support\Facades\Log;

class CredencialesService
{
    public function __construct(
        private readonly ExpedienteRepository $expedienteRepository,
        private readonly SolicitudParteRepository $solicitudParteRepository,
        private readonly SolicitudCorreoRepository $solicitudCorreoRepository,
        private readonly AsuntoRepository $asuntoRepository,
        private readonly CreadorUsuariosExpedienteService $creadorUsuarios,
        private readonly UsuarioExpedienteRepository $usuarioExpedienteRepository,
        private readonly MensajeService $mensajeService
    ) {}

    public function enviarCredencialesDemandado(int $idExpediente, string $mensaje = '', array $adjuntos = [], ?int $idUsuarioRemitente = null): array
    {
        try {
            Log::info("=== CredencialesService::enviarCredencialesDemandado ===");
            Log::info("ID Expediente: {$idExpediente}");
            Log::info("Mensaje: " . (strlen($mensaje) > 0 ? "SÍ ({$mensaje})" : "NO"));
            Log::info("Adjuntos: " . count($adjuntos) . " archivo(s)");
            Log::info("Usuario Remitente: {$idUsuarioRemitente}");
            
            $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
            
            if (!$expediente) {
                throw new Exception('Expediente no encontrado');
            }
            
            if ($expediente->credenciales_demandado_enviadas) {
                throw new Exception('Las credenciales del demandado ya fueron enviadas anteriormente');
            }
            
            // Obtener todos los correos de los demandados
            $correosDemandados = $this->obtenerCorreosDemandados($expediente->id_solicitud);
            
            if (empty($correosDemandados)) {
                throw new Exception('No se encontraron correos de demandados en la solicitud');
            }
            
            // Obtener el primer asunto activo del expediente para obtener el título
            $asuntos = $this->asuntoRepository->verAsuntosPorExpediente($idExpediente);
            $asunto = $asuntos->where('activo', true)->first();
            if (!$asunto) {
                throw new Exception('No se encontró ningún asunto activo del expediente');
            }
            
            Log::info("Enviando credenciales a " . count($correosDemandados) . " demandado(s)");
            
            // Crear usuarios y enviar credenciales CON mensaje y adjuntos
            $credencialesEnviadas = $this->creadorUsuarios->crearUsuariosPorCorreos(
                $correosDemandados, 
                $idExpediente, 
                'Demandado',
                $mensaje, // Incluir el mensaje
                $asunto->titulo, // Usar el título del asunto actual
                $adjuntos // Incluir adjuntos
            );
            
            Log::info("Usuarios creados: " . count($credencialesEnviadas));
            
            // Marcar credenciales como enviadas
            $this->expedienteRepository->actualizar($idExpediente, ['credenciales_demandado_enviadas' => true]);
            
            // Extraer los IDs de los usuarios creados
            $idsUsuariosCreados = array_map(fn($cred) => $cred['id_usuario'], $credencialesEnviadas);
            
            Log::info("IDs usuarios creados: " . implode(', ', $idsUsuariosCreados));
            
            // Si hay mensaje, guardarlo en la BD
            if (strlen($mensaje) > 0 && $idUsuarioRemitente) {
                Log::info("Guardando mensaje en BD...");
                
                try {
                    // Crear DTO para guardar el mensaje
                    $crearMensajeDTO = new CrearMensajeDTO(
                        id_usuario: $idUsuarioRemitente,
                        id_asunto: $asunto->id_asunto,
                        contenido: $mensaje
                    );
                    
                    // Los destinatarios son: staff del expediente + usuarios recién creados
                    $usuariosDestinatarios = array_merge(
                        $idsUsuariosCreados,
                        $this->obtenerUsuariosStaff($idExpediente)
                    );
                    
                    Log::info("Destinatarios del mensaje: " . implode(', ', $usuariosDestinatarios));
                    
                    // Guardar el mensaje con adjuntos
                    $this->mensajeService->crearMensaje($crearMensajeDTO, $usuariosDestinatarios, $adjuntos);
                    
                    Log::info("Mensaje guardado exitosamente en BD");
                    
                } catch (Exception $e) {
                    Log::error("Error al guardar mensaje en BD: " . $e->getMessage());
                    // No fallar el flujo de credenciales si hay error al guardar mensaje
                }
            }
            
            return [
                'success' => true,
                'message' => 'Credenciales enviadas exitosamente',
                'data' => [
                    'usuarios_creados' => count($credencialesEnviadas),
                    'correos_enviados' => array_keys($credencialesEnviadas),
                    'ids_usuarios' => $idsUsuariosCreados
                ]
            ];
            
        } catch (Exception $e) {
            Log::error("ERROR en CredencialesService: " . $e->getMessage());
            Log::error("Stack: " . $e->getTraceAsString());
            
            return [
                'success' => false,
                'message' => 'Error al enviar credenciales: ' . $e->getMessage()
            ];
        }
    }
    
    public function puedeEnviarCredenciales(int $idExpediente): bool
    {
        $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
        
        if (!$expediente) {
            return false;
        }
        
        if ($expediente->credenciales_demandado_enviadas) {
            return false;
        }
        
        if ($this->usuarioExpedienteRepository->existenDemandadosEnExpediente($idExpediente)) {
            return false;
        }
        
        return true;
    }

    public function obtenerDestinatariosParaCredenciales(int $idExpediente): array
    {
        $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
        
        if (!$expediente) {
            throw new Exception('Expediente no encontrado');
        }

        // Obtener participantes del expediente (staff: admin, secretario, árbitro)
        $participantesExpediente = $this->usuarioExpedienteRepository->obtenerPorExpediente($idExpediente);
        $staffIds = $participantesExpediente
            ->filter(function($participante) {
                return $participante->usuario && 
                       $participante->usuario->rol && 
                       in_array($participante->usuario->rol->nombre, ['Administrador', 'Secretario', 'Arbitro']);
            })
            ->pluck('id_usuario')
            ->toArray();

        // Obtener correos de demandados que se van a crear (para que el frontend los muestre)
        $correosDemandados = $this->obtenerCorreosDemandados($expediente->id_solicitud);
        
        return [
            'staff_ids' => $staffIds,
            'correos_demandados' => $correosDemandados,
            'total_destinatarios' => count($staffIds) + count($correosDemandados)
        ];
    }
    
    private function obtenerUsuariosStaff(int $idExpediente): array
    {
        $participantesExpediente = $this->usuarioExpedienteRepository->obtenerPorExpediente($idExpediente);
        
        $staffIds = $participantesExpediente
            ->filter(function($participante) {
                return $participante->usuario && 
                       $participante->usuario->rol && 
                       in_array($participante->usuario->rol->nombre, ['Administrador', 'Secretario', 'Arbitro']);
            })
            ->pluck('id_usuario')
            ->toArray();
        
        return $staffIds;
    }
    

    private function obtenerCorreosDemandados(int $idSolicitud): array
    {
        $partesDemandadas = $this->solicitudParteRepository->obtenerPorSolicitudYTipo($idSolicitud, 'demandado');
        
        if ($partesDemandadas->isEmpty()) {
            return [];
        }
        
        $correos = [];
        
        foreach ($partesDemandadas as $parte) {
            $correosPartes = $this->solicitudCorreoRepository->obtenerPorSolicitudParte($parte->id_solicitud_parte);
            
            foreach ($correosPartes as $correoObj) {
                if (!empty($correoObj->correo)) {
                    $correos[] = $correoObj->correo;
                }
            }
        }
        
        return array_values(array_unique($correos));
    }
}