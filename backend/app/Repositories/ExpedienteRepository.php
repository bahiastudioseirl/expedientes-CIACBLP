<?php

namespace App\Repositories;

use App\Models\Expediente;
use App\Models\ExpedienteParticipante;
use Illuminate\Database\Eloquent\Collection;

class ExpedienteRepository
{
    public function crear(array $data): Expediente
    {
        return Expediente::create($data);
    }

    public function actualizar(Expediente $expediente, array $data): bool
    {
        return $expediente->update($data);
    }

    public function cambiarEstado(Expediente $expediente, bool $activo): bool
    {
        $expediente->activo = $activo;
        return $expediente->save();
    }

    public function obtenerPorId(int $id_expediente): ?Expediente
    {
        return Expediente::with(['plantilla', 'solicitud'])->find($id_expediente);
    }

    

}