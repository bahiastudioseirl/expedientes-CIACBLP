<?php

namespace App\Http\Responses;

use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\JsonResponse;

class AsuntoResponse
{
    public static function asuntos(Collection $asuntos): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Asuntos obtenidos exitosamente',
            'data' => [
                'asuntos' => $asuntos->map(function ($asunto) {
                    return self::formatAsuntoExtendido($asunto);
                })
            ]
        ]);
    }


    public static function asuntoCreado($asunto): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Asunto creado exitosamente',
            'data' => [
                'asunto' => self::formatAsuntoExtendido($asunto)
            ]
        ], 201);
    }

    public static function asuntoEstado(array $resultado): JsonResponse
    {
        if ($resultado['success']) {
            return response()->json([
                'success' => true,
                'message' => $resultado['message'],
                'data' => [
                    'asunto' => $resultado['data'] ? self::formatAsuntoExtendido($resultado['data']) : null
                ]
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $resultado['message'],
                'data' => null
            ], 400);
        }
    }


    public static function formatAsuntoExtendido($asunto): array
    {
        $asunto->loadMissing(['flujo.etapa', 'flujo.subetapa']);

        return [
            'id_asunto'     => $asunto->id_asunto,
            'id_expediente' => $asunto->id_expediente,
            'titulo'        => $asunto->titulo,
            'activo'        => (bool) $asunto->activo,

            'flujo' => $asunto->flujo ? [
                'id_flujo' => $asunto->flujo->id_flujo,

                'etapa' => $asunto->flujo->etapa ? [
                    'id_etapa' => $asunto->flujo->etapa->id_etapa,
                    'nombre'   => $asunto->flujo->etapa->nombre,

                    'sub_etapa' => $asunto->flujo->subetapa ? [
                        'id_sub_etapa' => $asunto->flujo->subetapa->id_sub_etapa,
                        'nombre'      => $asunto->flujo->subetapa->nombre,
                    ] : null,

                ] : null,

            ] : null,
        ];
    }
}
