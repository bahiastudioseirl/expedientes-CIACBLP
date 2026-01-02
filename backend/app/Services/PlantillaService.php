<?php

namespace App\Services;

use App\DTOs\Plantillas\CrearPlantillaDTO;
use App\DTOs\Plantillas\ActualizarPlantillaDTO;
use App\Models\Plantilla;
use App\Repositories\PlantillaRepository;
use App\Repositories\EtapaRepository;
use App\Repositories\SubEtapaRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PlantillaService
{
    public function __construct(
        private readonly PlantillaRepository $plantillaRepository,
        private readonly EtapaRepository $etapaRepository,
        private readonly SubEtapaRepository $subEtapaRepository
    ){}

    public function crearPlantilla(CrearPlantillaDTO $data): Plantilla
    {
        return DB::transaction(function () use ($data) {
            // Crear plantilla
            $plantilla = $this->plantillaRepository->crear($data->toArray());

            // Crear etapas y sus sub-etapas
            foreach ($data->getEtapas() as $etapaData) {
                $subEtapasData = $etapaData['sub_etapas'] ?? [];
                
                // Crear etapa
                $etapaInfo = [
                    'nombre' => $etapaData['nombre'],
                    'id_plantilla' => $plantilla->id_plantilla
                ];
                
                $etapa = $this->etapaRepository->crear($etapaInfo);

                // Crear sub-etapas para esta etapa
                foreach ($subEtapasData as $index => $subEtapaData) {
                    $subEtapaInfo = [
                        'nombre' => $subEtapaData['nombre'] ?? 'Sub Etapa ' . ($index + 1),
                        'tiene_tiempo' => $subEtapaData['tiene_tiempo'],
                        'duracion_dias' => $subEtapaData['duracion_dias'] ?? null,
                        'es_opcional' => $subEtapaData['es_opcional'],
                        'id_etapa' => $etapa->id_etapa
                    ];
                    
                    $this->subEtapaRepository->crear($subEtapaInfo);
                }
            }

            return $plantilla->load(['etapas.subEtapas']);
        });
    }

    public function actualizarPlantilla(int $id, ActualizarPlantillaDTO $data): ?Plantilla
    {
        return DB::transaction(function () use ($id, $data) {
            $plantilla = $this->plantillaRepository->obtenerPorId($id);
            if (!$plantilla) {
                return null;
            }
            $this->plantillaRepository->actualizar($plantilla, $data->toArray());

            if ($data->getEtapas() !== null) {
                $this->actualizarEtapasCompleta($plantilla, $data->getEtapas());
            }

            return $plantilla->fresh(['etapas.subEtapas']);
        });
    }

    private function actualizarEtapasCompleta(Plantilla $plantilla, array $nuevasEtapas): void
    {
        $etapasExistentes = $plantilla->etapas->keyBy('id_etapa');
        $etapasEnviadas = collect();

        foreach ($nuevasEtapas as $etapaData) {
            $idEtapa = $etapaData['id_etapa'] ?? null;

            if ($idEtapa && $etapasExistentes->has($idEtapa)) {
                // Actualizar etapa existente
                $etapaExistente = $etapasExistentes->get($idEtapa);
                $this->etapaRepository->actualizar($etapaExistente, [
                    'nombre' => $etapaData['nombre']
                ]);

                // Actualizar sub-etapas de esta etapa
                $this->actualizarSubEtapasCompleta($etapaExistente, $etapaData['sub_etapas'] ?? []);
                
                $etapasEnviadas->push($idEtapa);
            } else {
                // Crear nueva etapa
                $etapaInfo = [
                    'nombre' => $etapaData['nombre'],
                    'id_plantilla' => $plantilla->id_plantilla
                ];
                
                $nuevaEtapa = $this->etapaRepository->crear($etapaInfo);

                // Crear sub-etapas para la nueva etapa
                foreach ($etapaData['sub_etapas'] ?? [] as $index => $subEtapaData) {
                    $subEtapaInfo = [
                        'nombre' => $subEtapaData['nombre'] ?? 'Sub Etapa ' . ($index + 1),
                        'tiene_tiempo' => $subEtapaData['tiene_tiempo'],
                        'duracion_dias' => $subEtapaData['duracion_dias'] ?? null,
                        'es_opcional' => $subEtapaData['es_opcional'],
                        'id_etapa' => $nuevaEtapa->id_etapa
                    ];
                    
                    $this->subEtapaRepository->crear($subEtapaInfo);
                }
            }
        }

        // Eliminar etapas que ya no están en la nueva estructura
        foreach ($etapasExistentes as $etapaExistente) {
            if (!$etapasEnviadas->contains($etapaExistente->id_etapa)) {
                $this->etapaRepository->eliminar($etapaExistente);
            }
        }
    }

    private function actualizarSubEtapasCompleta($etapa, array $nuevasSubEtapas): void
    {
        $subEtapasExistentes = $etapa->subEtapas->keyBy('id_sub_etapa');
        $subEtapasEnviadas = collect();

        foreach ($nuevasSubEtapas as $index => $subEtapaData) {
            $idSubEtapa = $subEtapaData['id_sub_etapa'] ?? null;

            if ($idSubEtapa && $subEtapasExistentes->has($idSubEtapa)) {
                // Actualizar sub-etapa existente
                $subEtapaExistente = $subEtapasExistentes->get($idSubEtapa);
                $this->subEtapaRepository->actualizar($subEtapaExistente, [
                    'nombre' => $subEtapaData['nombre'] ?? 'Sub Etapa ' . ($index + 1),
                    'tiene_tiempo' => $subEtapaData['tiene_tiempo'],
                    'duracion_dias' => $subEtapaData['duracion_dias'] ?? null,
                    'es_opcional' => $subEtapaData['es_opcional'],
                ]);
                
                $subEtapasEnviadas->push($idSubEtapa);
            } else {
                // Crear nueva sub-etapa
                $subEtapaInfo = [
                    'nombre' => $subEtapaData['nombre'] ?? 'Sub Etapa ' . ($index + 1),
                    'tiene_tiempo' => $subEtapaData['tiene_tiempo'],
                    'duracion_dias' => $subEtapaData['duracion_dias'] ?? null,
                    'es_opcional' => $subEtapaData['es_opcional'],
                    'id_etapa' => $etapa->id_etapa
                ];
                
                $this->subEtapaRepository->crear($subEtapaInfo);
            }
        }

        // Eliminar sub-etapas que ya no están en la nueva estructura
        foreach ($subEtapasExistentes as $subEtapaExistente) {
            if (!$subEtapasEnviadas->contains($subEtapaExistente->id_sub_etapa)) {
                $this->subEtapaRepository->eliminar($subEtapaExistente);
            }
        }
    }

    public function listarPlantillas(): Collection
    {
        return $this->plantillaRepository->listarPlantillas();
    }

    public function obtenerPlantillaPorId(int $id): ?Plantilla
    {
        return $this->plantillaRepository->obtenerPorId($id);
    }

    public function cambiarEstadoPlantilla(int $id): ?Plantilla
    {
        $plantilla = $this->plantillaRepository->obtenerPorId($id);
        if (!$plantilla) {
            return null;
        }
        
        $nuevoEstado = !$plantilla->activo;
        $this->plantillaRepository->cambiarEstadoPlantilla($plantilla, $nuevoEstado);
        
        return $plantilla->fresh()->load(['etapas.subEtapas']);
    }
}

