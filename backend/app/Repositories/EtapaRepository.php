<?php

namespace App\Repositories;

use App\Models\Etapa;
use Illuminate\Database\Eloquent\Collection;

class EtapaRepository
{
    public function crear(array $data): Etapa
    {
        return Etapa::create($data);
    }

    public function actualizar(Etapa $etapa, array $data): bool
    {
        return $etapa->update($data);
    }

    public function eliminar(Etapa $etapa): bool
    {
        return $etapa->delete();
    }

    public function obtenerPorId(int $id): ?Etapa
    {
        return Etapa::with('subEtapas')->find($id);
    }

    public function obtenerEtapasPorPlantilla(int $plantillaId): Collection
    {
        return Etapa::with(['subEtapas'])
        ->where('id_plantilla', $plantillaId)
        ->orderBy('id_etapa')
        ->get();
    }
}