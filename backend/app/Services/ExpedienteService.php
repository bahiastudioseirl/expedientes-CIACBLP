<?php

namespace App\Services;

use App\DTOs\Expedientes\CrearExpedienteDTO;
use App\Models\Expediente;
use App\Models\Solicitud;
use App\Services\SolicitudService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\SolicitudAdmitidaDemandante;
use App\Mail\CredencialesSecretario;
use App\Repositories\ExpedienteRepository;
use App\Repositories\Solicitud\SolicitudRepository;
use App\Services\Expediente\CreadorUsuariosExpedienteService;
use App\Services\Expediente\DuplicadorPlantillaService;
use App\Services\Expediente\GeneradorCodigoExpedienteService;
use App\Services\Expediente\InicializadorFlujoService;

class ExpedienteService
{
    public function __construct(
        private readonly GeneradorCodigoExpedienteService $generadorCodigo,
        private readonly CreadorUsuariosExpedienteService $creadorUsuarios,
        private readonly DuplicadorPlantillaService $duplicadorPlantilla,
        private readonly InicializadorFlujoService $inicializadorFlujo,
        private readonly SolicitudService $solicitudService,
        private readonly ExpedienteRepository $expedienteRepository,
        private readonly SolicitudRepository $solicitudRepository,
    ) {}

      public function crearDesdeSolicitud(CrearExpedienteDTO $dto): Expediente
    {
        return DB::transaction(function () use ($dto) {
            // 1. Obtener la solicitud
            $solicitud = $this->solicitudRepository->obtenerPorId($dto->id_solicitud);
            
            if (!$solicitud) {
                throw new \Exception("Solicitud con ID {$dto->id_solicitud} no encontrada");
            }

            // 2. Generar código de expediente
            $codigoExpediente = $this->generadorCodigo->generarCodigo();

            // 3. Duplicar la plantilla con ID 1
            $plantillaDuplicada = $this->duplicadorPlantilla->duplicarPlantilla(1, $codigoExpediente);

            // 4. Crear el expediente
            $expediente = $this->expedienteRepository->crear([
                'codigo_expediente' => $codigoExpediente,
                'id_plantilla' => $plantillaDuplicada->id_plantilla,
                'id_solicitud' => $solicitud->id_solicitud,
                'activo' => true,
            ]);

            // 5. Obtener correos de las partes (solo demandante)
            $datosPartes = $this->solicitudService->obtenerDatosPartes($solicitud->id_solicitud);
            $correosDemandante = is_array($datosPartes['demandante']->correos) 
                ? $datosPartes['demandante']->correos 
                : $datosPartes['demandante']->correos->pluck('correo')->toArray();

            // 6. Crear usuarios para demandantes
            $credencialesDemandantes = $this->creadorUsuarios->crearUsuariosPorCorreos(
                correos: $correosDemandante,
                idExpediente: $expediente->id_expediente,
                rolNombre: 'Demandante'
            );

            // 7. Crear usuario secretario
            $credencialesSecretario = $this->creadorUsuarios->crearUsuarioSecretario(
                nombreCompleto: $dto->nombre_secretario,
                correo: $dto->correo_secretario,
                telefono: $dto->telefono_secretario,
                idExpediente: $expediente->id_expediente
            );

            // 8. Inicializar el primer flujo
            $this->inicializadorFlujo->inicializarFlujo(
                expediente: $expediente,
                fechaInicioSolicitud: $solicitud->created_at
            );

            // 9. Enviar notificaciones
            $this->enviarNotificaciones(
                correosDemandante: $correosDemandante,
                credencialesDemandantes: $credencialesDemandantes,
                credencialesSecretario: $credencialesSecretario,
                codigoExpediente: $codigoExpediente
            );

            return $this->expedienteRepository->obtenerPorId($expediente->id_expediente);
        });
    }


















    /**
     * Envía las notificaciones por correo
     */
    private function enviarNotificaciones(
        array $correosDemandante,
        array $credencialesDemandantes,
        array $credencialesSecretario,
        string $codigoExpediente
    ): void {
        // Enviar correos a demandantes
        foreach ($correosDemandante as $correo) {
            if (isset($credencialesDemandantes[$correo])) {
                Mail::to($correo)->send(new SolicitudAdmitidaDemandante(
                    codigoExpediente: $codigoExpediente,
                    credenciales: $credencialesDemandantes[$correo],
                    secretario: $credencialesSecretario
                ));
            }
        }

        // Enviar correo al secretario
        Mail::to($credencialesSecretario['correo'])->send(new CredencialesSecretario(
            codigoExpediente: $codigoExpediente,
            credenciales: $credencialesSecretario
        ));
    }
}