<?php

namespace App\Services\Expediente;

use App\Repositories\ExpedienteRepository;
use App\Repositories\Solicitud\SolicitudParteRepository;
use App\Repositories\Solicitud\SolicitudCorreoRepository;
use App\Repositories\AsuntoRepository;
use App\Repositories\UsuarioExpedienteRepository;
use Exception;

class CredencialesService
{
    public function __construct(
        private readonly ExpedienteRepository $expedienteRepository,
        private readonly SolicitudParteRepository $solicitudParteRepository,
        private readonly SolicitudCorreoRepository $solicitudCorreoRepository,
        private readonly AsuntoRepository $asuntoRepository,
        private readonly CreadorUsuariosExpedienteService $creadorUsuarios,
        private readonly UsuarioExpedienteRepository $usuarioExpedienteRepository
    ) {}


    public function enviarCredencialesDemandado(int $idExpediente, string $mensaje = ''): array
    {
        try {
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
            
            // Usar el servicio existente para crear usuarios y enviar credenciales
            $credencialesEnviadas = $this->creadorUsuarios->crearUsuariosPorCorreos(
                $correosDemandados, 
                $idExpediente, 
                'Demandado',
                $mensaje,
                $asunto->titulo
            );
            
            // Marcar credenciales como enviadas
            $this->expedienteRepository->actualizar($idExpediente, ['credenciales_demandado_enviadas' => true]);
            
            // Extraer los IDs de los usuarios creados
            $idsUsuariosCreados = array_map(fn($cred) => $cred['id_usuario'], $credencialesEnviadas);
            
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