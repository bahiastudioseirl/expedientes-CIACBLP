<?php

namespace App\Repositories;

use App\Models\Mensajes;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

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
        return Mensajes::with(['usuario', 'asunto', 'adjuntos', 'respuestas.usuario'])
            ->where('id_asunto', $idAsunto)
            ->mensajesPrincipales()
            ->orderBy('fecha_envio', 'asc')
            ->get();
    }

    public function obtenerPorAsuntoYUsuario(int $idAsunto, int $idUsuario): Collection
    {
        return Mensajes::with(['usuario', 'asunto', 'adjuntos', 'respuestas.usuario'])
            ->where('id_asunto', $idAsunto)
            ->mensajesPrincipales()
            ->where(function($query) use ($idUsuario) {
                $query->where('id_usuario', $idUsuario) 
                      ->orWhereHas('usuariosMensajes', function($subQuery) use ($idUsuario) {
                          $subQuery->where('id_usuario', $idUsuario);
                      });
            })
            ->orderBy('fecha_envio', 'desc')
            ->get();
    }

    public function crearRespuesta(int $idMensajePadre, array $datos): Mensajes
    {
        $datos['mensaje_padre_id'] = $idMensajePadre;
        return $this->crear($datos);
    }

    public function obtenerHiloCompleto(int $idMensajePrincipal): Collection
    {
        return Mensajes::with(['usuario', 'adjuntos', 'respuestas.usuario'])
            ->where('id_mensaje', $idMensajePrincipal)
            ->orWhere('mensaje_padre_id', $idMensajePrincipal)
            ->orderBy('fecha_envio', 'asc')
            ->get();
    }

    public function obtenerRespuestas(int $idMensajePadre): Collection
    {
        return Mensajes::with(['usuario', 'adjuntos'])
            ->where('mensaje_padre_id', $idMensajePadre)
            ->orderBy('fecha_envio', 'asc')
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


    public function marcarComoLeido(int $idMensaje, int $idUsuario): bool
    {
        $mensajeUsuario = DB::table('usuarios_mensajes')
            ->where('id_mensaje', $idMensaje)
            ->where('id_usuario', $idUsuario)
            ->first();

        if ($mensajeUsuario) {
            return DB::table('usuarios_mensajes')
                ->where('id_mensaje', $idMensaje)
                ->where('id_usuario', $idUsuario)
                ->update(['leido' => true]) > 0;
        }

        return false;
    }
}