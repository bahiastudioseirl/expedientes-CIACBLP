<?php

namespace App\Services;

use App\DTOs\Flujos\CrearFlujoDTO;
use App\Models\Asunto;
use App\Models\Expediente;
use App\Models\SubEtapa;
use App\Repositories\FlujoRepository;
use Carbon\Carbon;

class FlujoService
{
    public function __construct(
        private readonly FlujoRepository $flujoRepository
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

    public function cambiarEtapaSubetapa(int $idExpediente, int $idEtapa, ?int $idSubetapa = null, string $asunto = ''): array
    {
        if (!$this->flujoRepository->validarEtapaEnPlantilla($idExpediente, $idEtapa, $idSubetapa)) {
            throw new \Exception('La etapa o subetapa seleccionada no pertenece a la plantilla del expediente');
        }

        $flujoActual = $this->flujoRepository->obtenerFlujoActual($idExpediente);
        if (!$flujoActual) {
            throw new \Exception('No se encontró un flujo activo para el expediente');
        }

        if ($flujoActual->id_etapa == $idEtapa && $flujoActual->id_subetapa == $idSubetapa) {
            throw new \Exception('La etapa y subetapa seleccionadas son las mismas que las actuales. No se realizó ningún cambio.');
        }

        $flujoCompletado = $this->flujoRepository->completarFlujo($flujoActual);
        if (!$flujoCompletado) {
            throw new \Exception('No se pudo completar el flujo actual');
        }

        $fechaFin = null;
        if ($idSubetapa) {
            $subetapa = SubEtapa::find($idSubetapa);
            if ($subetapa && $subetapa->tiene_tiempo && $subetapa->duracion_dias > 0) {
                $fechaFin = Carbon::now()->addDays($subetapa->duracion_dias);
            }
        }

        $nuevoFlujoDTO = CrearFlujoDTO::fromArray([
            'estado' => 'en proceso',
            'fecha_inicio' => Carbon::now()->format('Y-m-d H:i:s'),
            'fecha_fin' => $fechaFin ? $fechaFin->format('Y-m-d H:i:s') : null,
            'id_expediente' => $idExpediente,
            'id_etapa' => $idEtapa,
            'id_subetapa' => $idSubetapa
        ]);

        $nuevoFlujo = $this->flujoRepository->crear($nuevoFlujoDTO->toArray());

        $this->flujoRepository->crearAsuntoParaFlujo($idExpediente, $nuevoFlujo->id_flujo, $asunto);

        return [
            'success' => true,
            'message' => 'Etapa, subetapa y asunto creados correctamente',
            'data' => $this->flujoRepository->obtenerPorId($nuevoFlujo->id_flujo)
        ];
    }

    public function actualizarFlujoYAsunto(int $idFlujo, int $idEtapa, ?int $idSubetapa = null, string $asunto = ''): array
    {
        $flujo = $this->flujoRepository->obtenerPorId($idFlujo);
        if (!$flujo) {
            throw new \Exception('Flujo no encontrado');
        }

        if ($flujo->estado !== 'en proceso') {
            throw new \Exception('Solo se pueden actualizar flujos que estén en proceso');
        }

        // Validar que la etapa y subetapa pertenezcan a la plantilla del expediente
        if (!$this->flujoRepository->validarEtapaEnPlantilla($flujo->id_expediente, $idEtapa, $idSubetapa)) {
            throw new \Exception('La etapa o subetapa seleccionada no pertenece a la plantilla del expediente');
        }

        $fechaFin = $flujo->fecha_fin;
        if ($idSubetapa && $idSubetapa != $flujo->id_subetapa) {
            $subetapa = SubEtapa::find($idSubetapa);
            if ($subetapa && $subetapa->tiene_tiempo && $subetapa->duracion_dias > 0) {
                $fechaFin = Carbon::now()->addDays($subetapa->duracion_dias);
            } else {
                $fechaFin = null;
            }
        }
        
        $datosActualizacion = [
            'id_etapa' => $idEtapa,
            'id_subetapa' => $idSubetapa,
            'fecha_fin' => $fechaFin
        ];
        
        $flujoActualizado = $this->flujoRepository->actualizar($flujo, $datosActualizacion);
        if (!$flujoActualizado) {
            throw new \Exception('No se pudo actualizar el flujo');
        }

        $asuntoFlujo = Asunto::where('id_flujo', $idFlujo)->first();
        if ($asuntoFlujo && !empty($asunto)) {
            $expediente = Expediente::with('participantes.usuario')->find($flujo->id_expediente);
            $demandante = null;
            $demandado = null;
            foreach ($expediente->participantes as $participante) {
                if ($participante->rol_en_expediente === 'Demandante') {
                    $demandante = $participante->usuario->nombre_empresa ?? 'Demandante';
                } elseif ($participante->rol_en_expediente === 'Demandado') {
                    $demandado = $participante->usuario->nombre_empresa ?? 'Demandado';
                }
            }
            $nuevoTitulo = ($demandante ?? 'Demandante') . ' - ' . ($demandado ?? 'Demandado') .
                          ' // Caso arbitral ' . $expediente->codigo_expediente .
                          ' | ' . $asunto;
            $asuntoFlujo->update(['titulo' => $nuevoTitulo]);
        }

        return [
            'success' => true,
            'message' => 'Flujo y asunto actualizados correctamente',
            'data' => $this->flujoRepository->obtenerPorId($flujo->id_flujo)
        ];
    }
    
}