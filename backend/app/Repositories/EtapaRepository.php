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
        ->orderBy('orden')
        ->get();
    }

    public function reordenarEtapasDesde(int $plantillaId, int $ordenInicio): void
    {
        Etapa::where('id_plantilla', $plantillaId)
            ->where('orden', '>=', $ordenInicio)
            ->increment('orden');
    }

    public function obtenerSiguienteOrden(int $plantillaId): int
    {
        $maxOrden = Etapa::where('id_plantilla', $plantillaId)->max('orden');
        return ($maxOrden ?? 0) + 1;
    }

    public function reajustarOrdenesEtapas(int $plantillaId): void
    {
        $etapas = Etapa::where('id_plantilla', $plantillaId)
            ->orderBy('orden')
            ->get();
        
        $orden = 1;
        foreach ($etapas as $etapa) {
            $etapa->update(['orden' => $orden]);
            $orden++;
        }
    }

    public function obtenerEtapaPorId(int $idEtapa): ?Etapa
    {
        return Etapa::find($idEtapa);
    }
}