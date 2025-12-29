<?php

namespace App\Repositories;

use App\Models\Adjuntos;
use Illuminate\Database\Eloquent\Collection;

class AdjuntoRepository
{
    public function crear(array $datos): Adjuntos
    {
        return Adjuntos::create($datos);
    }

    public function obtenerPorId(int $id): ?Adjuntos
    {
        return Adjuntos::find($id);
    }

    public function obtenerPorMensaje(int $idMensaje): Collection
    {
        return Adjuntos::where('id_mensaje', $idMensaje)->get();
    }

    public function eliminar(int $id): bool
    {
        return Adjuntos::where('id_adjunto', $id)->delete();
    }

    public function eliminarPorMensaje(int $idMensaje): bool
    {
        return Adjuntos::where('id_mensaje', $idMensaje)->delete();
    }
}