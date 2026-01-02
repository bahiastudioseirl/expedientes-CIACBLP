<?php

namespace App\Http\Responses;

use App\Models\Expediente;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\JsonResponse;

class ExpedienteResponse
{
    public static function expedienteCreado(Expediente $expediente): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Expediente creado exitosamente',
            'data' => [
                'expediente' => self::formatExpediente($expediente),
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
            'asunto' => $expediente->asunto?->titulo ?? null,
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
                $usuario = $participante->usuario;
                $rol = $participante->rol_en_expediente;

                $usuarioData = [
                    'id_usuario' => $usuario->id_usuario,
                    'numero_documento' => $usuario->numero_documento,
                ];

                if (in_array($rol, ['Demandante', 'Demandado'])) {
                    $usuarioData['nombre_empresa'] = $usuario->nombre_empresa;
                } else {
                    $usuarioData['nombre'] = $usuario->nombre;
                    $usuarioData['apellido'] = $usuario->apellido;
                }

                $usuarioData += [
                    'id_rol' => $usuario->rol?->id_rol ?? null,
                    'rol_nombre' => $usuario->rol?->nombre ?? null,
                    'telefono' => $usuario->telefono,
                    'correos' => $usuario->correos?->pluck('direccion')->toArray() ?? []
                ];

                return [
                    'usuario' => $usuarioData
                ];
            }) ?? [],
            'created_at' => $expediente->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $expediente->updated_at?->format('Y-m-d H:i:s')
        ];
    }
}
