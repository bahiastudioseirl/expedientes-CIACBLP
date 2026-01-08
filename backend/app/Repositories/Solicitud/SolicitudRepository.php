<?php

namespace App\Repositories\Solicitud;

use App\Models\Solicitud;
use Illuminate\Database\Eloquent\Collection;

class SolicitudRepository
{
    public function crear(array $data): Solicitud
    {
        return Solicitud::create($data);
    }

    public function obtenerPorId(int $id): ?Solicitud
    {
        return Solicitud::find($id);
    }

    public function obtenerPorUsuario(int $id_usuario_solicitante): Collection
    {
        return Solicitud::where('id_usuario_solicitante', $id_usuario_solicitante)->get();
    }

    public function actualizar(int $id, array $data): bool
    {
        return Solicitud::where('id_solicitud', $id)->update($data);
    }
}