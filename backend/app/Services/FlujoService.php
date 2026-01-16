<?php

namespace App\Services;

use App\DTOs\Flujos\CambiarFlujoDTO;
use App\DTOs\Flujos\ActualizarFlujoDTO;
use App\Repositories\EtapaRepository;
use App\Repositories\ExpedienteRepository;
use App\Repositories\FlujoRepository;
use App\Repositories\MensajeRepository;
use App\Repositories\SubEtapaRepository;
use App\Services\Expediente\CalculadorDiasHabilesService;

class FlujoService
{
    public function __construct(
        private readonly FlujoRepository $flujoRepository,
        private readonly SubEtapaRepository $subEtapaRepository,
        private readonly CalculadorDiasHabilesService $calculadorDiasHabiles,
        private readonly ExpedienteRepository $expedienteRepository,
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

        return $this->flujoRepository->crear($nuevoFlujoData);
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

}