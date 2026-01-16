<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class CaminoFlujoResponse
{
    public static function caminoExpediente(array $data): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Camino del expediente obtenido exitosamente',
            'data' => [
                'expediente' => self::formatearExpediente($data['expediente']),
                'flujos' => self::formatearFlujosConMensajes($data['flujos'], $data['mensajes_agrupados'])
            ]
        ]);
    }

    private static function formatearExpediente($expediente): array
    {
        return [
            'codigo_expediente' => $expediente->codigo_expediente,
            'id_expediente' => $expediente->id_expediente,
            'activo' => $expediente->activo,
            'created_at' => $expediente->created_at,
            'demandante' => self::formatearParticipantes($expediente->solicitud->demandante ?? []),
            'demandado' => self::formatearParticipantes($expediente->solicitud->demandado ?? []),
            'arbitro' => self::formatearUsuario(self::obtenerParticipantePorRol($expediente, 'Arbitro')),
            'secretario' => self::formatearUsuario(self::obtenerParticipantePorRol($expediente, 'Secretario'))
        ];
    }

    private static function formatearParticipantes($participantes): array
    {
        if (!$participantes) return [];
        
        return collect($participantes)->map(function ($participante) {
            return [
                'nombre_razon' => $participante->nombre_razon ?? 'N/A',
                'numero_documento' => $participante->numero_documento ?? 'N/A',
                'telefono' => $participante->telefono ?? 'N/A',
                'correos' => $participante->correos ?? []
            ];
        })->values()->toArray();
    }

    private static function formatearUsuario($usuario): ?array
    {
        if (!$usuario) return null;
        
        return [
            'id' => $usuario->id_usuario,
            'nombre_completo' => $usuario->nombre_completo,
            'correo' => $usuario->correo,
            'telefono' => $usuario->telefono,
            'rol' => $usuario->nombre_rol
        ];
    }

    private static function formatearFlujos($flujos): array
    {
        return collect($flujos)->map(function ($flujo) {
            return [
                'id_flujo' => $flujo->id_flujo,
                'estado' => $flujo->estado,
                'estado_calculado' => $flujo->estado_calculado ?? $flujo->estado,
                'fecha_inicio' => $flujo->fecha_inicio,
                'fecha_limite' => $flujo->fecha_limite,
                'fecha_fin' => $flujo->fecha_fin,
                'etapa' => $flujo->etapa ? [
                    'id_etapa' => $flujo->etapa->id_etapa,
                    'nombre' => $flujo->etapa->nombre
                ] : null,
                'subetapa' => $flujo->subetapa ? [
                    'id_sub_etapa' => $flujo->subetapa->id_sub_etapa,
                    'nombre' => $flujo->subetapa->nombre
                ] : null
            ];
        })->values()->toArray();
    }

    private static function formatearFlujosConMensajes($flujos, $mensajesAgrupados): array
    {
        return collect($flujos)->map(function ($flujo) use ($mensajesAgrupados) {
            $mensajesDelFlujo = $mensajesAgrupados->get($flujo->id_flujo, collect([]));
            
            return [
                'id_flujo' => $flujo->id_flujo,
                'estado' => $flujo->estado,
                'estado_calculado' => $flujo->estado_calculado ?? $flujo->estado,
                'fecha_inicio' => $flujo->fecha_inicio,
                'fecha_limite' => $flujo->fecha_limite,
                'fecha_fin' => $flujo->fecha_fin,
                'etapa' => $flujo->etapa ? [
                    'id_etapa' => $flujo->etapa->id_etapa,
                    'nombre' => $flujo->etapa->nombre
                ] : null,
                'subetapa' => $flujo->subetapa ? [
                    'id_sub_etapa' => $flujo->subetapa->id_sub_etapa,
                    'nombre' => $flujo->subetapa->nombre
                ] : null,
                'mensajes' => self::formatearMensajes($mensajesDelFlujo)
            ];
        })->values()->toArray();
    }

    private static function formatearMensajes($mensajes): array
    {
        return collect($mensajes)->map(function ($mensaje) {
            return [
                'id_mensaje' => $mensaje->id_mensaje,
                'contenido' => $mensaje->contenido,
                'fecha_envio' => $mensaje->fecha_envio,
                'usuario' => [
                    'id' => $mensaje->usuario->id_usuario,
                    'nombre_completo' => $mensaje->usuario->nombre_completo,
                    'rol' => $mensaje->usuario->nombre_rol
                ],
                'adjuntos' => collect($mensaje->adjuntos)->map(function ($adjunto) {
                    return [
                        'id_adjunto' => $adjunto->id_adjunto,
                        'nombre_archivo' => $adjunto->nombre_archivo,
                        'ruta_archivo' => $adjunto->ruta_archivo,
                        'url_descarga' => url('public/' . $adjunto->ruta_archivo)
                    ];
                })->toArray()
            ];
        })->values()->toArray();
    }

    private static function obtenerParticipantePorRol($expediente, string $nombreRol): ?object
    {
        foreach ($expediente->participantes as $participante) {
            if ($participante->usuario && $participante->usuario->nombre_rol === $nombreRol) {
                return $participante->usuario;
            }
        }
        return null;
    }
}
