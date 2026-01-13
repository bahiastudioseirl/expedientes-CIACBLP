<?php

namespace App\Services\Expediente;

use App\Models\Plantilla;
use App\Repositories\PlantillaRepository;
use App\Repositories\EtapaRepository;
use App\Repositories\SubEtapaRepository;
use Illuminate\Support\Facades\DB;

class DuplicadorPlantillaService
{
    public function __construct(
        private readonly PlantillaRepository $plantillaRepository,
        private readonly EtapaRepository $etapaRepository,
        private readonly SubEtapaRepository $subEtapaRepository
    ) {}

    /**
     * Duplicar una plantilla con todas sus etapas y sub-etapas
     */
    public function duplicarPlantilla(int $idPlantillaOriginal, string $codigoExpediente): Plantilla
    {
        return DB::transaction(function () use ($idPlantillaOriginal, $codigoExpediente) {
            $plantillaOriginal = $this->plantillaRepository->obtenerPorId($idPlantillaOriginal);
            
            if (!$plantillaOriginal) {
                throw new \Exception("Plantilla con ID {$idPlantillaOriginal} no encontrada");
            }
            
            $nuevaPlantilla = $this->plantillaRepository->crear([
                'nombre' => "Plantilla de Exp. N° {$codigoExpediente}",
                'descripcion' => $plantillaOriginal->descripcion,
                'activo' => true,
            ]);

            foreach ($plantillaOriginal->etapas as $etapaOriginal) {
                $nuevaEtapa = $this->etapaRepository->crear([
                    'id_plantilla' => $nuevaPlantilla->id_plantilla,
                    'nombre' => $etapaOriginal->nombre,
                    'descripcion' => $etapaOriginal->descripcion,
                    'orden' => $etapaOriginal->orden,
                ]);

                foreach ($etapaOriginal->subEtapas as $subEtapaOriginal) {
                    $this->subEtapaRepository->crear([
                        'id_etapa' => $nuevaEtapa->id_etapa,
                        'nombre' => $subEtapaOriginal->nombre,
                        'descripcion' => $subEtapaOriginal->descripcion,
                        'orden' => $subEtapaOriginal->orden,
                        'dias_habiles' => $subEtapaOriginal->dias_habiles,
                        'es_habil' => $subEtapaOriginal->es_habil,
                        'es_obligatorio' => $subEtapaOriginal->es_obligatorio,
                    ]);
                }
            }

            return $this->plantillaRepository->obtenerPorId($nuevaPlantilla->id_plantilla);
        });
    }
}