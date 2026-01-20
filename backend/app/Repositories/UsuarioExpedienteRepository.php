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
        return UsuarioExpediente::with(['usuario.rol'])
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

    public function existeVinculo(int $idUsuario, int $idExpediente): bool
    {
        return UsuarioExpediente::where('id_usuario', $idUsuario)
            ->where('id_expediente', $idExpediente)
            ->exists();
    }

    public function existenDemandadosEnExpediente(int $idExpediente): bool
    {
        return UsuarioExpediente::where('id_expediente', $idExpediente)
            ->whereHas('usuario.rol', function ($query) {
                $query->where('nombre', 'Demandado');
            })
            ->exists();
    }

    
}
