<?php

namespace App\Repositories\Solicitud;

use App\Models\SolicitudDesignacion;
use App\Models\SolicitudArbitro;


class SolicitudDesignacionRepository
{
    public function crear(array $data): SolicitudDesignacion
    {
        return SolicitudDesignacion::create($data);
    }

    public function crearArbitro(array $data): SolicitudArbitro
    {
        return SolicitudArbitro::create($data);
    }

    public function crearArbitrosMultiples(array $arbitros): void
    {
        foreach ($arbitros as $arbitroData) {
            SolicitudArbitro::create($arbitroData);
        }
    }

    public function obtenerPorSolicitud(int $id_solicitud): ?SolicitudDesignacion
    {
        return SolicitudDesignacion::where('id_solicitud', $id_solicitud)->first();
    }
}