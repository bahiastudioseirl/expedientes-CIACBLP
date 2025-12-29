<?php

namespace App\Repositories;

use App\Models\UsuariosMensajes;
use Illuminate\Database\Eloquent\Collection;

class UsuarioMensajeRepository
{
    public function crear(array $datos): UsuariosMensajes
    {
        return UsuariosMensajes::create($datos);
    }

    public function crearMultiples(array $datosMultiples): bool
    {
        return UsuariosMensajes::insert($datosMultiples);
    }

    public function obtenerPorId(int $id): ?UsuariosMensajes
    {
        return UsuariosMensajes::find($id);
    }

    public function obtenerPorUsuarioYMensaje(int $idUsuario, int $idMensaje): ?UsuariosMensajes
    {
        return UsuariosMensajes::where('id_usuario', $idUsuario)
            ->where('id_mensaje', $idMensaje)
            ->first();
    }

    public function marcarComoLeido(int $idUsuario, int $idMensaje): bool
    {
        return UsuariosMensajes::where('id_usuario', $idUsuario)
            ->where('id_mensaje', $idMensaje)
            ->update(['leido' => true]);
    }

}