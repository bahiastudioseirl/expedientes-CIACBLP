<?php

namespace App\Repositories\Solicitud;

use App\Models\SolicitudRepresentante;

class SolicitudRepresentanteRepository
{
    public function crear(array $data): SolicitudRepresentante
    {
        return SolicitudRepresentante::create($data);
    }

    public function obtenerPorSolicitud(int $id_solicitud): ?\Illuminate\Database\Eloquent\Collection
    {
        return SolicitudRepresentante::where('id_solicitud', $id_solicitud)->get();
    }
}