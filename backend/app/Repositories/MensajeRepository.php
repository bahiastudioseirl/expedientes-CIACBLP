<?php

namespace App\Repositories;

use App\Models\Mensajes;
use Illuminate\Database\Eloquent\Collection;

class MensajeRepository
{
    public function crear(array $datos): Mensajes
    {
        return Mensajes::create($datos);
    }

    public function obtenerPorId(int $id): ?Mensajes
    {
        return Mensajes::with(['usuario', 'asunto', 'adjuntos'])
            ->find($id);
    }

    public function obtenerPorAsunto(int $idAsunto): Collection
    {
        return Mensajes::with(['usuario', 'asunto', 'adjuntos'])
            ->where('id_asunto', $idAsunto)
            ->orderBy('fecha_envio', 'desc')
            ->get();
    }

    public function obtenerPorAsuntoYUsuario(int $idAsunto, int $idUsuario): Collection
    {
        return Mensajes::with(['usuario', 'asunto', 'adjuntos'])
            ->where('id_asunto', $idAsunto)
            ->where(function($query) use ($idUsuario) {
                $query->where('id_usuario', $idUsuario) // Mensajes enviados por el usuario
                      ->orWhereHas('usuariosMensajes', function($subQuery) use ($idUsuario) {
                          $subQuery->where('id_usuario', $idUsuario); // Mensajes recibidos por el usuario
                      });
            })
            ->orderBy('fecha_envio', 'desc')
            ->get();
    }

    public function obtenerPorUsuario(int $idUsuario): Collection
    {
        return Mensajes::with(['usuario', 'asunto', 'adjuntos'])
            ->whereHas('usuariosMensajes', function($query) use ($idUsuario) {
                $query->where('id_usuario', $idUsuario);
            })
            ->orWhere('id_usuario', $idUsuario)
            ->orderBy('fecha_envio', 'desc')
            ->get();
    }

    public function listar(): Collection
    {
        return Mensajes::with(['usuario', 'asunto', 'adjuntos'])
            ->orderBy('fecha_envio', 'desc')
            ->get();
    }

    public function actualizar(int $id, array $datos): bool
    {
        return Mensajes::where('id_mensaje', $id)->update($datos);
    }

    public function eliminar(int $id): bool
    {
        return Mensajes::where('id_mensaje', $id)->delete();
    }
}