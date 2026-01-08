<?php

namespace App\Repositories\Solicitud;

use App\Models\SolicitudPretension;
use Illuminate\Database\Eloquent\Collection;

class SolicitudPretensionRepository
{
    public function crear(array $data): SolicitudPretension
    {
        return SolicitudPretension::create($data);
    }

    public function crearMultiples(array $pretensiones): void
    {
        SolicitudPretension::insert($pretensiones);
    }

    public function obtenerPorSolicitud(int $id_solicitud): Collection
    {
        return SolicitudPretension::where('id_solicitud', $id_solicitud)->get();
    }
}