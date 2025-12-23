<?php

namespace App\Repositories;

use App\Models\Plantilla;
use Illuminate\Database\Eloquent\Collection;

class PlantillaRepository
{
    public function crear(array $data): Plantilla
    {
        return Plantilla::create($data);
    }

    public function actualizar(Plantilla $plantilla, array $data): bool
    {
        return $plantilla->update($data);
    }

    public function listarPlantillas(): Collection
    {
        return Plantilla::with(['etapas.subEtapas'])->get();
    }

    public function obtenerPorId(int $id): ?Plantilla
    {
        return Plantilla::with(['etapas.subEtapas'])->find($id);
    }

    public function eliminar(Plantilla $plantilla): bool
    {
        return $plantilla->delete();
    }

    public function cambiarEstadoPlantilla(Plantilla $plantilla, bool $activo): bool
    {
        $plantilla->activo = $activo;
        return $plantilla->save();
    }
}