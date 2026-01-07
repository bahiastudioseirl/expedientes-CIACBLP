<?php

namespace App\Http\Responses;

use App\Models\Mensajes;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\JsonResponse;

class MensajeResponse
{
    public static function mensajeCreado(Mensajes $mensaje): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Mensaje enviado exitosamente',
            'data' => [
                'mensaje' => self::formatMensaje($mensaje)
            ]
        ], 201);
    }

    public static function mensaje(Mensajes $mensaje): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Mensaje obtenido exitosamente',
            'data' => [
                'mensaje' => self::formatMensaje($mensaje)
            ]
        ]);
    }

    public static function mensajes(Collection $mensajes): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Mensajes obtenidos exitosamente',
            'data' => [
                'mensajes' => $mensajes->map(function ($mensaje) {
                    return self::formatMensaje($mensaje);
                })
            ]
        ]);
    }

    public static function marcarComoLeido(bool $exito): JsonResponse
    {
        if ($exito) {
            return response()->json([
                'success' => true,
                'message' => 'Mensaje marcado como leído exitosamente'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo marcar el mensaje como leído'
            ], 400);
        }
    }

    public static function formatMensaje(Mensajes $mensaje): array
    {
        return [
            'id_mensaje' => $mensaje->id_mensaje,
            'contenido' => $mensaje->contenido,
            'fecha_envio' => $mensaje->fecha_envio,
            'usuario_remitente' => [
                'id_usuario' => $mensaje->usuario->id_usuario,
                'nombre' => $mensaje->usuario->nombre ?? $mensaje->usuario->nombre_empresa,
                'apellido' => $mensaje->usuario->apellido,
                'numero_documento' => $mensaje->usuario->numero_documento
            ],
            'asunto' => [
                'id_asunto' => $mensaje->asunto->id_asunto,
            ],
            'adjuntos' => $mensaje->adjuntos?->map(function ($adjunto) {
                return [
                    'id_adjunto' => $adjunto->id_adjunto,
                    'ruta_archivo' => url($adjunto->ruta_archivo),
                    'nombre_archivo' => $adjunto->nombre_archivo ?? basename($adjunto->ruta_archivo)
                ];
            }) ?? [],
            'respuestas' => $mensaje->respuestas?->map(function ($respuesta) {
                return self::formatMensaje($respuesta);
            }) ?? [],
            'created_at' => $mensaje->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $mensaje->updated_at?->format('Y-m-d H:i:s')
        ];
    }
}