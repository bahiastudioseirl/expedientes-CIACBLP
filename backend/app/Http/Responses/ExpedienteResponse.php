<?php

namespace App\Http\Responses;

use App\Models\Expediente;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\JsonResponse;

class ExpedienteResponse
{
    public static function expedienteCreado(Expediente $expediente, array $usuariosInfo = []): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Expediente creado exitosamente',
            'data' => [
                'expediente' => self::formatExpediente($expediente),
                'usuarios_info' => $usuariosInfo
            ]
        ], 201);
    }

    public static function expediente(Expediente $expediente): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Expediente obtenido exitosamente',
            'data' => [
                'expediente' => self::formatExpediente($expediente)
            ]
        ]);
    }

    public static function expedientes(Collection $expedientes): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Expedientes obtenidos exitosamente',
            'data' => [
                'expedientes' => $expedientes->map(function ($expediente) {
                    return self::formatExpediente($expediente);
                })
            ]
        ]);
    }

    public static function formatExpediente(Expediente $expediente): array
    {
        return [
            'id_expediente' => $expediente->id_expediente,
            'codigo_expediente' => $expediente->codigo_expediente,
            'asunto' => $expediente->asunto,
            'activo' => (bool) $expediente->activo,
            'plantilla' => [
                'id_plantilla' => $expediente->plantilla->id_plantilla ?? null,
                'nombre' => $expediente->plantilla->nombre ?? null
            ],
            'usuario_creador' => [
                'id_usuario' => $expediente->usuario->id_usuario ?? null,
                'nombre' => $expediente->usuario->nombre ?? null,
                'apellido' => $expediente->usuario->apellido ?? null
            ],
            'participantes' => $expediente->participantes?->map(function ($participante) {
                return [
                    'rol' => $participante->rol_en_expediente,
                    'usuario' => [
                        'id_usuario' => $participante->usuario->id_usuario,
                        'numero_documento' => $participante->usuario->numero_documento,
                        'nombre' => $participante->usuario->nombre,
                        'apellido' => $participante->usuario->apellido,
                        'telefono' => $participante->usuario->telefono,
                        'correos' => $participante->usuario->correos?->pluck('direccion')->toArray() ?? []
                    ]
                ];
            }) ?? [],
            'created_at' => $expediente->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $expediente->updated_at?->format('Y-m-d H:i:s')
        ];
    }
}