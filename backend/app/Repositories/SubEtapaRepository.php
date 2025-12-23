<?php

namespace App\Repositories;

use App\Models\SubEtapa;

class SubEtapaRepository
{
    public function crear(array $data): SubEtapa
    {
        return SubEtapa::create($data);
    }
    
    public function actualizar(SubEtapa $subEtapa, array $data): bool
    {
        return $subEtapa->update($data);
    }

    public function eliminar(SubEtapa $subEtapa): bool
    {
        return $subEtapa->delete();
    }

    public function obtenerPorId(int $id): ?SubEtapa
    {
        return SubEtapa::find($id);
    }
}