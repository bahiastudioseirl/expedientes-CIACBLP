<?php

namespace App\Repositories;

use App\Models\Flujo;
use Illuminate\Database\Eloquent\Collection;

class FlujoRepository
{
    public function crear(array $data): Flujo
    {
        return Flujo::create($data);
    }

    public function obtenerPorId(int $id): ?Flujo
    {
        return Flujo::with(['expediente', 'etapa', 'subetapa'])->find($id);
    }

    public function obtenerPorExpediente(int $idExpediente): Collection
    {
        return Flujo::with(['etapa', 'subetapa'])
                   ->where('id_expediente', $idExpediente)
                   ->orderBy('fecha_inicio')
                   ->get();
    }

    public function actualizar(Flujo $flujo, array $data): bool
    {
        return $flujo->update($data);
    }

    public function obtenerFlujoActual(int $idExpediente): ?Flujo
    {
        return Flujo::with(['etapa', 'subetapa'])
                   ->where('id_expediente', $idExpediente)
                   ->where('estado', 'en proceso')
                   ->first();
    }
}