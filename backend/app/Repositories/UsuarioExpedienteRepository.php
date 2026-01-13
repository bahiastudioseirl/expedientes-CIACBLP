<?php

namespace App\Repositories;

use App\Models\UsuarioExpediente;
use Illuminate\Database\Eloquent\Collection;

class UsuarioExpedienteRepository
{
    public function crear(array $data): UsuarioExpediente
    {
        return UsuarioExpediente::create($data);
    }

    public function obtenerPorExpediente(int $idExpediente): Collection
    {
        return UsuarioExpediente::with('usuario')
            ->where('id_expediente', $idExpediente)
            ->get();
    }

    public function obtenerPorUsuario(int $idUsuario): Collection
    {
        return UsuarioExpediente::with('expediente')
            ->where('id_usuario', $idUsuario)
            ->get();
    }

    public function eliminar(int $idUsuario, int $idExpediente): bool
    {
        return UsuarioExpediente::where('id_usuario', $idUsuario)
            ->where('id_expediente', $idExpediente)
            ->delete();
    }
}
