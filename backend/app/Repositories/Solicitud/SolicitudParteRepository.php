<?php

namespace App\Repositories\Solicitud;

use App\Models\SolicitudParte;
use Illuminate\Database\Eloquent\Collection;

class SolicitudParteRepository
{
    public function crear(array $data): SolicitudParte
    {
        return SolicitudParte::create($data);
    }

    public function obtenerPorSolicitud(int $id_solicitud): Collection
    {
        return SolicitudParte::where('id_solicitud', $id_solicitud)->get();
    }

    public function obtenerPorId(int $id): ?SolicitudParte
    {
        return SolicitudParte::find($id);
    }
}