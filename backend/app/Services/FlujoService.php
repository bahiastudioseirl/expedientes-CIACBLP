<?php

namespace App\Services;

use App\DTOs\Flujos\CambiarFlujoDTO;
use App\DTOs\Flujos\ActualizarFlujoDTO;
use App\Repositories\EtapaRepository;
use App\Repositories\ExpedienteRepository;
use App\Repositories\FlujoRepository;
use App\Repositories\MensajeRepository;
use App\Repositories\SubEtapaRepository;
use App\Repositories\UsuarioRepository;
use App\Services\Expediente\CalculadorDiasHabilesService;
use App\Models\Usuarios;
use App\Mail\NotificacionContador;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class FlujoService
{
    public function __construct(
        private readonly FlujoRepository $flujoRepository,
        private readonly SubEtapaRepository $subEtapaRepository,
        private readonly CalculadorDiasHabilesService $calculadorDiasHabiles,
        private readonly ExpedienteRepository $expedienteRepository,
        private readonly UsuarioRepository $usuarioRepository,
        private readonly EtapaRepository $etapaRepository,
        private readonly MensajeRepository $mensajeRepository
    )
    {}

    public function obtenerFlujosPorExpediente(int $idExpediente)
    {
        return $this->flujoRepository->obtenerPorExpediente($idExpediente);
    }

    public function obtenerFlujoActual(int $idExpediente)
    {
        return $this->flujoRepository->obtenerFlujoActual($idExpediente);
    }

    public function cambiarEtapaSubetapa(int $idExpediente, CambiarFlujoDTO $data): \App\Models\Flujo
    {
        if (!$this->flujoRepository->validarEtapaEnPlantilla($idExpediente, $data->id_etapa, $data->id_subetapa)) {
            throw new \Exception('La etapa o subetapa seleccionada no pertenece a la plantilla del expediente');
        }
        $flujoActual = $this->flujoRepository->obtenerFlujoActual($idExpediente);
        if (!$flujoActual) {
            throw new \Exception('No se encontró un flujo activo para el expediente');
        }
        $this->flujoRepository->completarFlujo($flujoActual);

        $fechaLimite = null;
        if ($data->id_subetapa) {
            $subetapa = $this->subEtapaRepository->obtenerPorId($data->id_subetapa);
            if ($subetapa && $subetapa->es_habil && $subetapa->dias_habiles > 0) {
                $fechaLimite = $this->calculadorDiasHabiles->calcularFechaLimite(now(), $subetapa->dias_habiles);
            }
        }
        $nuevoFlujoData = [
            'id_expediente' => $idExpediente,
            'id_etapa' => $data->id_etapa,
            'id_subetapa' => $data->id_subetapa,
            'estado' => 'en_proceso',
            'fecha_inicio' => now(),
            'fecha_limite' => $fechaLimite,
            'fecha_fin' => null
        ];

        $nuevoFlujo = $this->flujoRepository->crear($nuevoFlujoData);
        
        // Notificar al contador si se llega a la sub etapa 5 de la etapa 1
        $this->notificarContadorSiEsNecesario($idExpediente, $data->id_etapa, $data->id_subetapa);
        
        return $nuevoFlujo;
    }

    public function actualizarFlujo(int $idExpediente, ActualizarFlujoDTO $data): \App\Models\Flujo
    {
        if (!$this->flujoRepository->validarEtapaEnPlantilla($idExpediente, $data->id_etapa, $data->id_subetapa)) {
            throw new \Exception('La etapa o subetapa seleccionada no pertenece a la plantilla del expediente');
        }

        $flujo = $this->flujoRepository->obtenerFlujoActual($idExpediente);
        if (!$flujo) {
            throw new \Exception('No se encontró un flujo activo para el expediente');
        }

        $fechaLimite = null;
        if ($data->id_subetapa) {
            $subetapa = $this->subEtapaRepository->obtenerPorId($data->id_subetapa);
            if ($subetapa && $subetapa->es_habil && $subetapa->dias_habiles > 0) {
                $fechaLimite = $this->calculadorDiasHabiles->calcularFechaLimite(now(), $subetapa->dias_habiles);
            }
        }

        $datosActualizacion = [
            'id_etapa' => $data->id_etapa,
            'id_subetapa' => $data->id_subetapa,
            'fecha_limite' => $fechaLimite
        ];

        $this->flujoRepository->actualizar($flujo, $datosActualizacion);
        return $flujo->fresh();
    }






    
    public function obtenerEtapasPlantillaExpediente(int $idExpediente)
    {
        $idPlantilla = $this->expedienteRepository->obtenerIdPlantillaPorExpediente($idExpediente);
        if (!$idPlantilla) {
            throw new \Exception('No se encontró la plantilla del expediente');
        }
        return $this->etapaRepository->obtenerEtapasPorPlantilla($idPlantilla);
    }

    public function listarFlujosPorExpediente(int $idExpediente)
    {
        return $this->flujoRepository->listarFlujosPorExpediente($idExpediente);
    }

    public function obtenerCaminoExpediente(int $idExpediente)
    {
        $expediente = $this->expedienteRepository->obtenerExpedienteCompleto($idExpediente);
        
        if (!$expediente) {
            throw new \Exception('Expediente no encontrado');
        }

        $flujos = $this->flujoRepository->listarFlujosPorExpediente($idExpediente);
        
        $mensajesAgrupados = $this->mensajeRepository->obtenerMensajesAgrupadosPorFlujo($idExpediente);
        
        return [
            'expediente' => $expediente,
            'flujos' => $flujos,
            'mensajes_agrupados' => $mensajesAgrupados
        ];
    }

    private function notificarContadorSiEsNecesario(int $idExpediente, int $idEtapa, ?int $idSubetapa): void
    {
        Log::info("Iniciando verificación de notificación al contador", [
            'id_expediente' => $idExpediente,
            'id_etapa' => $idEtapa,
            'id_subetapa' => $idSubetapa
        ]);

        if (!$idSubetapa) {
            Log::info("No hay subetapa, omitiendo notificación");
            return;
        }

        // Verificar si es la etapa 1
        $etapa = $this->etapaRepository->obtenerEtapaPorId($idEtapa);
        Log::info("Datos de etapa obtenidos", [
            'etapa_encontrada' => $etapa ? 'sí' : 'no',
            'etapa_orden' => $etapa ? $etapa->orden : 'N/A',
            'etapa_orden_tipo' => $etapa ? gettype($etapa->orden) : 'N/A'
        ]);
        
        if (!$etapa || (int)$etapa->orden !== 1) {
            Log::info("No es la etapa 1, omitiendo notificación", [
                'orden_actual' => $etapa ? $etapa->orden : 'N/A',
                'comparacion_resultado' => $etapa ? ((int)$etapa->orden !== 1 ? 'no es 1' : 'es 1') : 'no hay etapa'
            ]);
            return;
        }

        // Verificar si es la sub etapa 5
        $subetapa = $this->subEtapaRepository->obtenerPorId($idSubetapa);
        Log::info("Datos de subetapa obtenidos", [
            'subetapa_encontrada' => $subetapa ? 'sí' : 'no',
            'subetapa_orden' => $subetapa ? $subetapa->orden : 'N/A',
            'subetapa_orden_tipo' => $subetapa ? gettype($subetapa->orden) : 'N/A'
        ]);
        
        if (!$subetapa || (int)$subetapa->orden !== 5) {
            Log::info("No es la subetapa 5, omitiendo notificación", [
                'orden_actual' => $subetapa ? $subetapa->orden : 'N/A',
                'comparacion_resultado' => $subetapa ? ((int)$subetapa->orden !== 5 ? 'no es 5' : 'es 5') : 'no hay subetapa'
            ]);
            return;
        }

        $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
        if (!$expediente) {
            Log::error("Expediente no encontrado", ['id_expediente' => $idExpediente]);
            return;
        }

        $contador = $this->usuarioRepository->obtenerPorRol('Contador');
        Log::info("Buscando contador", [
            'contador_encontrado' => $contador ? 'sí' : 'no',
            'contador_correo' => $contador ? $contador->correo : 'N/A',
            'contador_activo' => $contador ? $contador->activo : 'N/A'
        ]);
        
        if (!$contador) {
            Log::warning("No se encontró usuario con rol Contador para notificar en expediente {$expediente->codigo_expediente}");
            return;
        }

        if (!$contador->activo) {
            Log::warning("El contador encontrado está inactivo", [
                'contador_id' => $contador->id_usuario,
                'contador_correo' => $contador->correo
            ]);
            return;
        }

        try {
            Log::info("Intentando enviar correo al contador", [
                'destinatario' => $contador->correo,
                'codigo_expediente' => $expediente->codigo_expediente
            ]);
            
            Mail::to($contador->correo)->send(new NotificacionContador(
                codigoExpediente: $expediente->codigo_expediente,
                nombreContador: $contador->nombre_completo
            ));
            
            Log::info("Correo enviado exitosamente al contador");
        } catch (\Exception $e) {
            Log::error("Error al enviar notificación al contador: " . $e->getMessage(), [
                'exception' => $e,
                'codigo_expediente' => $expediente->codigo_expediente,
                'contador_correo' => $contador->correo
            ]);
        }
    }

}