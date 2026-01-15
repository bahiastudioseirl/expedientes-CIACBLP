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

            foreach ($data->getEtapas() as $index => $etapaData) {
                $subEtapasData = $etapaData['sub_etapas'] ?? [];
                
                // Determinar el orden de la etapa
                $orden = $etapaData['orden'] ?? ($index + 1);
                
                // Crear etapa
                $etapaInfo = [
                    'nombre' => $etapaData['nombre'],
                    'id_plantilla' => $plantilla->id_plantilla,
                    'orden' => $orden
                ];
                
                $etapa = $this->etapaRepository->crear($etapaInfo);

                // Crear sub-etapas para esta etapa
                foreach ($subEtapasData as $subIndex => $subEtapaData) {
                    $subOrden = $subEtapaData['orden'] ?? ($subIndex + 1);
                    
                    $subEtapaInfo = [
                        'nombre' => $subEtapaData['nombre'] ?? 'Sub Etapa ' . ($subIndex + 1),
                        'descripcion' => $subEtapaData['descripcion'] ?? null,
                        'orden' => $subOrden,
                        'dias_habiles' => $subEtapaData['dias_habiles'] ?? 0,
                        'es_habil' => $subEtapaData['es_habil'] ?? true,
                        'es_obligatorio' => $subEtapaData['es_obligatorio'] ?? true,
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

        foreach ($nuevasEtapas as $index => $etapaData) {
            $idEtapa = $etapaData['id_etapa'] ?? null;
            $ordenDeseado = $etapaData['orden'] ?? ($index + 1);

            if ($idEtapa && $etapasExistentes->has($idEtapa)) {
                // Actualizar etapa existente
                $etapaExistente = $etapasExistentes->get($idEtapa);
                
                if ($etapaExistente->orden != $ordenDeseado) {
                    if ($ordenDeseado < $etapaExistente->orden) {
                        $this->etapaRepository->reordenarEtapasDesde($plantilla->id_plantilla, $ordenDeseado);
                    }
                }
                
                $this->etapaRepository->actualizar($etapaExistente, [
                    'nombre' => $etapaData['nombre'],
                    'orden' => $ordenDeseado
                ]);

                // Actualizar sub-etapas de esta etapa
                $this->actualizarSubEtapasCompleta($etapaExistente, $etapaData['sub_etapas'] ?? []);
                
                $etapasEnviadas->push($idEtapa);
            } else {
                // Crear nueva etapa - hacer espacio si es necesario
                $this->etapaRepository->reordenarEtapasDesde($plantilla->id_plantilla, $ordenDeseado);
                
                $etapaInfo = [
                    'nombre' => $etapaData['nombre'],
                    'id_plantilla' => $plantilla->id_plantilla,
                    'orden' => $ordenDeseado
                ];
                
                $nuevaEtapa = $this->etapaRepository->crear($etapaInfo);

                // Crear sub-etapas para la nueva etapa
                foreach ($etapaData['sub_etapas'] ?? [] as $subIndex => $subEtapaData) {
                    $subOrden = $subEtapaData['orden'] ?? ($subIndex + 1);
                    
                    $subEtapaInfo = [
                        'nombre' => $subEtapaData['nombre'] ?? 'Sub Etapa ' . ($subIndex + 1),
                        'descripcion' => $subEtapaData['descripcion'] ?? null,
                        'orden' => $subOrden,
                        'dias_habiles' => $subEtapaData['dias_habiles'] ?? 0,
                        'es_habil' => $subEtapaData['es_habil'] ?? true,
                        'es_obligatorio' => $subEtapaData['es_obligatorio'] ?? true,
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
        
        // Reajustar todos los órdenes para que sean consecutivos
        $this->etapaRepository->reajustarOrdenesEtapas($plantilla->id_plantilla);
    }

    private function actualizarSubEtapasCompleta($etapa, array $nuevasSubEtapas): void
    {
        $subEtapasExistentes = $etapa->subEtapas->keyBy('id_sub_etapa');
        $subEtapasEnviadas = collect();

        foreach ($nuevasSubEtapas as $index => $subEtapaData) {
            $idSubEtapa = $subEtapaData['id_sub_etapa'] ?? null;
            $ordenDeseado = $subEtapaData['orden'] ?? ($index + 1);

            if ($idSubEtapa && $subEtapasExistentes->has($idSubEtapa)) {
                // Actualizar sub-etapa existente
                $subEtapaExistente = $subEtapasExistentes->get($idSubEtapa);
                
                // Si el orden cambió, reordenar
                if ($subEtapaExistente->orden != $ordenDeseado) {
                    if ($ordenDeseado < $subEtapaExistente->orden) {
                        $this->subEtapaRepository->reordenarSubEtapasDesde($etapa->id_etapa, $ordenDeseado);
                    }
                }
                
                $this->subEtapaRepository->actualizar($subEtapaExistente, [
                    'nombre' => $subEtapaData['nombre'] ?? 'Sub Etapa ' . ($index + 1),
                    'descripcion' => $subEtapaData['descripcion'] ?? null,
                    'orden' => $ordenDeseado,
                    'dias_habiles' => $subEtapaData['dias_habiles'] ?? 0,
                    'es_habil' => $subEtapaData['es_habil'] ?? true,
                    'es_obligatorio' => $subEtapaData['es_obligatorio'] ?? true,
                ]);
                
                $subEtapasEnviadas->push($idSubEtapa);
            } else {
                // Crear nueva sub-etapa - hacer espacio si es necesario
                $this->subEtapaRepository->reordenarSubEtapasDesde($etapa->id_etapa, $ordenDeseado);
                
                $subEtapaInfo = [
                    'nombre' => $subEtapaData['nombre'] ?? 'Sub Etapa ' . ($index + 1),
                    'descripcion' => $subEtapaData['descripcion'] ?? null,
                    'orden' => $ordenDeseado,
                    'dias_habiles' => $subEtapaData['dias_habiles'] ?? 0,
                    'es_habil' => $subEtapaData['es_habil'] ?? true,
                    'es_obligatorio' => $subEtapaData['es_obligatorio'] ?? true,
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
        
        // Reajustar todos los órdenes para que sean consecutivos
        $this->subEtapaRepository->reajustarOrdenesSubEtapas($etapa->id_etapa);
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

    public function obtenerEtapasPlantilla($id): ?array
    {
        $plantilla = $this->plantillaRepository->obtenerPorId($id);
        
        if (!$plantilla) {
            return null;
        }

        $etapas = $this->etapaRepository->obtenerEtapasPorPlantilla($id);
        
        return $etapas->map(function ($etapa) {
            return [
                'id_etapa' => $etapa->id_etapa,
                'nombre' => $etapa->nombre,
                'subetapas' => $etapa->subEtapas->map(function ($subEtapa) {
                    return [
                        'id_sub_etapa' => $subEtapa->id_sub_etapa,
                        'nombre' => $subEtapa->nombre
                    ];
                })->values()->toArray()
            ];
        })->values()->toArray();
    }
}

