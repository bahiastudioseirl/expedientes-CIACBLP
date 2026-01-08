<?php

namespace App\Repositories\Solicitud;

use App\Models\SolicitudCorreo;
use Illuminate\Database\Eloquent\Collection;

class SolicitudCorreoRepository
{
    public function crear(array $data): SolicitudCorreo
    {
        return SolicitudCorreo::create($data);
    }

    public function crearMultiples(array $correos): void
    {
        SolicitudCorreo::insert($correos);
    }

    public function obtenerPorParte(int $id_solicitud_parte): Collection
    {
        return SolicitudCorreo::where('id_solicitud_parte', $id_solicitud_parte)->get();
    }
}