<?php

namespace App\Services;

use App\DTOs\Expedientes\CrearExpedienteDTO;
use App\DTOs\Expedientes\ActualizarExpedienteDTO;
use App\Models\Expediente;
use App\Repositories\AsuntoRepository;
use App\Repositories\ExpedienteRepository;
use App\Repositories\UsuarioRepository;
use App\Repositories\CorreoRepository;
use App\Repositories\FlujoRepository;
use App\Repositories\PlantillaRepository;
use App\Services\MailService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ExpedienteService
{
    public function __construct(
        private readonly ExpedienteRepository $expedienteRepository,
        private readonly UsuarioRepository $usuarioRepository,
        private readonly CorreoRepository $correoRepository,
        private readonly FlujoRepository $flujoRepository,
        private readonly PlantillaRepository $plantillaRepository,
        private readonly MailService $mailService,
        private readonly AsuntoRepository $asuntoRepository

    ){}

    public function crearExpediente(CrearExpedienteDTO $data): array
    {
        return DB::transaction(function () use ($data) {
            $usuariosInfo = [];

            // 1. Crear expediente
            $expediente = $this->expedienteRepository->crear($data->toArray());

            // 2. Manejar todos los participantes con la nueva lógica
            $demandante = $this->manejarParticipante($data->demandante, 'Demandante');
            $demandado = $this->manejarParticipante($data->demandado, 'Demandado');
            $secretario = $this->manejarParticipante($data->secretario_arbitral, 'Secretario Arbitral');
            $arbitro = $this->manejarParticipante($data->arbitro_a_cargo, 'Árbitro a Cargo');

            $usuariosInfo = [$demandante, $demandado, $secretario, $arbitro];

            // 3. Crear participantes en el expediente
            $this->expedienteRepository->crearParticipante([
                'id_expediente' => $expediente->id_expediente,
                'id_usuario' => $demandante['usuario']->id_usuario,
                'rol_en_expediente' => 'Demandante'
            ]);

            $this->expedienteRepository->crearParticipante([
                'id_expediente' => $expediente->id_expediente,
                'id_usuario' => $demandado['usuario']->id_usuario,
                'rol_en_expediente' => 'Demandado'
            ]);

            $this->expedienteRepository->crearParticipante([
                'id_expediente' => $expediente->id_expediente,
                'id_usuario' => $secretario['usuario']->id_usuario,
                'rol_en_expediente' => 'Secretario Arbitral'
            ]);

            $this->expedienteRepository->crearParticipante([
                'id_expediente' => $expediente->id_expediente,
                'id_usuario' => $arbitro['usuario']->id_usuario,
                'rol_en_expediente' => 'Árbitro a Cargo'
            ]);

            // 4. Crear flujo inicial del expediente

            // 4. Crear flujo inicial del expediente y obtener el primer flujo creado
            $this->crearFlujoInicial($expediente->id_expediente, $data->id_plantilla);

            $primerFlujo = $this->flujoRepository->obtenerFlujoActual($expediente->id_expediente);
            
            $this->crearPrimerAsunto($expediente->id_expediente, $primerFlujo?->id_flujo);

            // 5. Cargar expediente completo
            $expedienteCompleto = $this->expedienteRepository->obtenerPorId($expediente->id_expediente);

            // 6. Enviar correos con credenciales a todos los participantes
            $this->enviarCredencialesParticipantes($expedienteCompleto, [
                $demandante['usuario'],
                $demandado['usuario'],
                $secretario['usuario'],
                $arbitro['usuario']
            ]);

            return [
                'expediente' => $expedienteCompleto,
                'usuarios_info' => $usuariosInfo
            ];
        });
    }


    /**
     * Maneja un participante: verifica si existe por numero_documento,
     * actualiza sus datos si existe, o lo crea si no existe
     */
    private function manejarParticipante(array $dataParticipante, string $rol): array
    {
        $numeroDocumento = $dataParticipante['numero_documento'];
        $usuarioExistente = $this->usuarioRepository->obtenerPorNumeroDocumento($numeroDocumento);
        
        if ($usuarioExistente) {
            return $this->actualizarUsuarioExistenteDual($usuarioExistente, $dataParticipante, $rol);
        } else {
            return $this->crearNuevoUsuario($dataParticipante, $rol);
        }
    }


    /**
     * Actualiza un usuario existente con los nuevos datos y maneja sus correos
     */
    private function actualizarUsuarioExistente($usuario, array $dataParticipante, string $rol): array
    {
        $datosActualizacion = [];
        
        if ($rol === 'Demandante' || $rol === 'Demandado') {
            $datosActualizacion['nombre_empresa'] = $dataParticipante['nombre_empresa'];
        } else {
            $datosActualizacion['nombre'] = $dataParticipante['nombre'];
            $datosActualizacion['apellido'] = $dataParticipante['apellido'];
        }
        
        $datosActualizacion['telefono'] = $dataParticipante['telefono'] ?? $usuario->telefono;

        $usuarioActualizado = $this->usuarioRepository->actualizar($usuario, $datosActualizacion);

        $this->sincronizarCorreosUsuario($usuario->id_usuario, $dataParticipante['correos']);
        $usuarioCompleto = $this->usuarioRepository->obtenerPorId($usuario->id_usuario);

        return [
            'usuario' => $usuarioCompleto,
            'accion' => 'actualizado',
            'rol' => $rol,
            'contrasena_generada' => null
        ];
    }

    /**
     * Maneja usuarios existentes que pueden venir del sistema o de árbitros
     * Para árbitros, crea un nuevo usuario en el sistema basado en sus datos
     */
    private function actualizarUsuarioExistenteDual(array $usuarioData, array $dataParticipante, string $rol): array
    {
        if ($usuarioData['tipo'] === 'usuario_sistema') {
            $usuario = $this->usuarioRepository->obtenerPorNumeroDocumentoLegacy($usuarioData['numero_documento']);
            return $this->actualizarUsuarioExistente($usuario, $dataParticipante, $rol);
        } else {
            $datosParticipante = [
                'numero_documento' => $usuarioData['numero_documento'],
                'telefono' => $usuarioData['telefono'] ?? $dataParticipante['telefono'],
                'correos' => $usuarioData['correos'] ?? ($dataParticipante['correos'] ?? [])
            ];
            
            // Para demandantes y demandados usar nombre_empresa, para otros usar nombre/apellido
            if ($rol === 'Demandante' || $rol === 'Demandado') {
                $datosParticipante['nombre_empresa'] = $usuarioData['nombre_empresa'] ?? $dataParticipante['nombre_empresa'];
            } else {
                $datosParticipante['nombre'] = $usuarioData['nombre'];
                $datosParticipante['apellido'] = $usuarioData['apellido'];
            }

            return $this->crearNuevoUsuario($datosParticipante, $rol);
        }
    }

    /**
     * Crea un nuevo usuario con contraseña automática
     */
    private function crearNuevoUsuario(array $dataParticipante, string $rol): array
    {
        $contrasena = $this->mailService->generarContrasenaAleatoria();

        // Crear usuario
        $usuarioData = [
            'numero_documento' => $dataParticipante['numero_documento'],
            'telefono' => $dataParticipante['telefono'] ?? null,
            'contrasena' => $contrasena,
            'activo' => true,
            'id_rol' => $this->obtenerIdRolSegunTipo($rol)
        ];
        
        // Para demandantes y demandados usar nombre_empresa, para otros usar nombre/apellido
        if ($rol === 'Demandante' || $rol === 'Demandado') {
            $usuarioData['nombre_empresa'] = $dataParticipante['nombre_empresa'];
        } else {
            $usuarioData['nombre'] = $dataParticipante['nombre'];
            $usuarioData['apellido'] = $dataParticipante['apellido'];
        }

        $usuario = $this->usuarioRepository->crear($usuarioData);
        $usuario->setContrasenaTextoPlano($contrasena);
        $this->correoRepository->crearMultiples($usuario->id_usuario, $dataParticipante['correos']);

        return [
            'usuario' => $usuario->load('correos'),
            'accion' => 'creado',
            'rol' => $rol,
            'contrasena_generada' => $contrasena
        ];
    }



    /**
     * Sincroniza los correos de un usuario:
     * - Mantiene los correos que ya existen y siguen en la lista
     * - Agrega los correos nuevos
     * - Elimina los correos que ya no están en la lista
     */
    private function sincronizarCorreosUsuario(int $idUsuario, array $nuevosCorreos): void
    {
        $correosExistentes = $this->correoRepository->obtenerCorreosPorUsuario($idUsuario);
        $correosExistentesArray = $correosExistentes->pluck('direccion')->toArray();

        $correosParaAgregar = array_diff($nuevosCorreos, $correosExistentesArray);
        
        $correosParaEliminar = array_diff($correosExistentesArray, $nuevosCorreos);

        if (!empty($correosParaAgregar)) {
            $this->correoRepository->crearMultiples($idUsuario, $correosParaAgregar);
        }

        if (!empty($correosParaEliminar)) {
            $this->correoRepository->eliminarPorCorreos($idUsuario, $correosParaEliminar);
        }
    }

    private function obtenerIdRolSegunTipo(string $tipoRol): int
    {
        return match($tipoRol) {
            'Demandante' => 4,           // ID 4 = Demandante
            'Demandado' => 5,            // ID 5 = Demandado
            'Secretario Arbitral' => 3,  // ID 3 = Secretario
            'Árbitro a Cargo' => 2,      // ID 2 = Arbitro
            default => 4                 // Por defecto Demandante si no se reconoce el tipo
        };
    }


    public function listarExpedientes(): Collection
    {
        return $this->expedienteRepository->listarExpedientes();
    }

    public function obtenerExpedientePorId(int $id): ?Expediente
    {
        return $this->expedienteRepository->obtenerPorId($id);
    }

    public function obtenerPorCodigoExpediente(string $codigo): ?Expediente
    {
        return $this->expedienteRepository->obtenerPorCodigoExpediente($codigo);
    }

    public function cambiarEstadoExpediente(int $id): ?Expediente
    {
        $expediente = $this->expedienteRepository->obtenerPorId($id);
        if (!$expediente) {
            return null;
        }
        
        $nuevoEstado = !$expediente->activo;
        $this->expedienteRepository->cambiarEstado($expediente, $nuevoEstado);
        
        return $expediente->fresh();
    }

    /**
     * Verifica si un usuario existe por número de documento
     * Útil para validaciones desde el frontend
     */
    public function verificarUsuarioPorDocumento(string $numeroDocumento): array
    {
        $usuario = $this->usuarioRepository->obtenerPorNumeroDocumento($numeroDocumento);
        
        if ($usuario) {
            return [
                'existe' => true,
                'usuario' => [
                    'id_usuario' => $usuario['id'],
                    'nombre' => $usuario['nombre'],
                    'apellido' => $usuario['apellido'],
                    'numero_documento' => $usuario['numero_documento'],
                    'telefono' => $usuario['telefono'],
                    'correos' => $usuario['correos'] ?? [], 
                    'rol' => $usuario['rol'] ?? 'Árbitro',
                    'tipo' => $usuario['tipo'] 
                ]
            ];
        }
        
        return [
            'existe' => false,
            'usuario' => null
        ];
    }

    public function actualizarExpediente(ActualizarExpedienteDTO $data): array
    {
        return DB::transaction(function () use ($data) {
            // 1. Obtener expediente actual
            $expediente = $this->expedienteRepository->obtenerPorId($data->id_expediente);
            if (!$expediente) {
                throw new \Exception("Expediente no encontrado");
            }

            $plantillaAnterior = $expediente->id_plantilla;
            $usuariosInfo = [];

            // 2. Actualizar datos básicos del expediente
            $this->expedienteRepository->actualizar($expediente, $data->toExpedienteArray());

            // 3. Manejar todos los participantes con la nueva lógica
            $demandante = $this->manejarParticipante($data->demandante, 'Demandante');
            $demandado = $this->manejarParticipante($data->demandado, 'Demandado');
            $secretario = $this->manejarParticipante($data->secretario_arbitral, 'Secretario Arbitral');
            $arbitro = $this->manejarParticipante($data->arbitro_a_cargo, 'Árbitro a Cargo');

            $usuariosInfo = [$demandante, $demandado, $secretario, $arbitro];

            // 4. Eliminar participantes antiguos y crear los nuevos
            $this->expedienteRepository->eliminarParticipantes($expediente->id_expediente);

            $this->expedienteRepository->crearParticipante([
                'id_expediente' => $expediente->id_expediente,
                'id_usuario' => $demandante['usuario']->id_usuario,
                'rol_en_expediente' => 'Demandante'
            ]);

            $this->expedienteRepository->crearParticipante([
                'id_expediente' => $expediente->id_expediente,
                'id_usuario' => $demandado['usuario']->id_usuario,
                'rol_en_expediente' => 'Demandado'
            ]);

            $this->expedienteRepository->crearParticipante([
                'id_expediente' => $expediente->id_expediente,
                'id_usuario' => $secretario['usuario']->id_usuario,
                'rol_en_expediente' => 'Secretario Arbitral'
            ]);

            $this->expedienteRepository->crearParticipante([
                'id_expediente' => $expediente->id_expediente,
                'id_usuario' => $arbitro['usuario']->id_usuario,
                'rol_en_expediente' => 'Árbitro a Cargo'
            ]);

            // 5. Si cambió la plantilla, recrear flujo inicial
            if ($plantillaAnterior !== $data->id_plantilla) {
                $this->recrearFlujoInicial($expediente->id_expediente, $data->id_plantilla);
            }

            // 6. Cargar expediente completo actualizado
            $expedienteCompleto = $this->expedienteRepository->obtenerPorId($expediente->id_expediente);

            return [
                'expediente' => $expedienteCompleto,
                'usuarios_info' => $usuariosInfo,
                'plantilla_cambiada' => $plantillaAnterior !== $data->id_plantilla
            ];
        });
    }

    /**
     * Recrear el flujo inicial cuando cambia la plantilla del expediente
     */
    private function recrearFlujoInicial(int $idExpediente, int $idPlantilla): void
    {
        $flujoActual = $this->flujoRepository->obtenerFlujoActual($idExpediente);
        if ($flujoActual) {
            $this->flujoRepository->actualizar($flujoActual, [
                'estado' => 'cancelado por cambio de plantilla'
            ]);
        }

        $this->crearFlujoInicial($idExpediente, $idPlantilla);
    }

    private function crearFlujoInicial(int $idExpediente, int $idPlantilla): void
    {
        $plantilla = $this->plantillaRepository->obtenerPorId($idPlantilla);
        
        if (!$plantilla || $plantilla->etapas->isEmpty()) {
            throw new \Exception("La plantilla no tiene etapas definidas");
        }

        $primeraEtapa = $plantilla->etapas->first();
        
        if ($primeraEtapa->subEtapas->isEmpty()) {
            throw new \Exception("La primera etapa no tiene subetapas definidas");
        }

        $primeraSubEtapa = $primeraEtapa->subEtapas->first();

        $fechaInicio = Carbon::now();
        $fechaFin = $primeraSubEtapa->tiene_tiempo && $primeraSubEtapa->duracion_dias > 0 
            ? $fechaInicio->copy()->addDays($primeraSubEtapa->duracion_dias)
            : null;

        $this->flujoRepository->crear([
            'id_expediente' => $idExpediente,
            'id_etapa' => $primeraEtapa->id_etapa,
            'id_subetapa' => $primeraSubEtapa->id_sub_etapa,
            'estado' => 'en proceso',
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin
        ]);
    }

    private function crearPrimerAsunto(int $idExpediente, int $idFlujo): void
    {
        $flujo = $this->flujoRepository->obtenerPorId($idFlujo);
        if (!$flujo) {
            throw new \Exception("Flujo no encontrado para crear el asunto");
        }

        $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
        if (!$expediente) {
            throw new \Exception("Expediente no encontrado para crear el asunto");
        }

        $demandante = null;
        $demandado = null;
        
        foreach ($expediente->participantes as $participante) {
            if ($participante->rol_en_expediente === 'Demandante') {
                $demandante = $participante->usuario->nombre_empresa ?? 'Demandante';
            } elseif ($participante->rol_en_expediente === 'Demandado') {
                $demandado = $participante->usuario->nombre_empresa ?? 'Demandado';
            }
        }

        $titulo = ($demandante ?? 'Demandante') . ' - ' . ($demandado ?? 'Demandado') . 
                  ' // Caso arbitral ' . $expediente->codigo_expediente . 
                  ' | ' . $expediente->asunto;

        $this->asuntoRepository->crear([
            'titulo' => $titulo,
            'activo' => true,
            'id_flujo' => $flujo->id_flujo,
            'id_expediente' => $idExpediente
        ]);
    }

    private function enviarCredencialesParticipantes($expediente, array $usuarios): void
    {
        foreach ($usuarios as $usuario) {
            $this->mailService->enviarCredencialesExpediente($usuario, $expediente->codigo_expediente);
        }
    }

    /**
     * Listar expedientes según asignación de usuario.
     * Si el usuario es admin (id_rol = 1), retorna todos los expedientes.
     */
    public function listarExpedientesPorUsuario(int $idUsuario, int $idRol): Collection
    {
        return $this->expedienteRepository->listarExpedientesPorUsuario($idUsuario, $idRol);
    }

}