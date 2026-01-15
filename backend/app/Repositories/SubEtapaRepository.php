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

    public function reordenarSubEtapasDesde(int $etapaId, int $ordenInicio): void
    {
        SubEtapa::where('id_etapa', $etapaId)
            ->where('orden', '>=', $ordenInicio)
            ->increment('orden');
    }

    public function obtenerSiguienteOrden(int $etapaId): int
    {
        $maxOrden = SubEtapa::where('id_etapa', $etapaId)->max('orden');
        return ($maxOrden ?? 0) + 1;
    }

    public function reajustarOrdenesSubEtapas(int $etapaId): void
    {
        $subEtapas = SubEtapa::where('id_etapa', $etapaId)
            ->orderBy('orden')
            ->get();
        
        $orden = 1;
        foreach ($subEtapas as $subEtapa) {
            $subEtapa->update(['orden' => $orden]);
            $orden++;
        }
    }
}