<?php

namespace App\Repositories\Solicitud;

use App\Models\SolicitudDemandadoExtra;

class SolicitudDemandadoExtraRepository
{
    public function crear(array $data): SolicitudDemandadoExtra
    {
        return SolicitudDemandadoExtra::create($data);
    }

}