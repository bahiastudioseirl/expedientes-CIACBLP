<?php

namespace App\Http\Responses;

use App\Models\Flujo;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\JsonResponse;

class FlujoResponse
{
    public static function flujos(Collection $flujos): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Flujos obtenidos exitosamente',
            'data' => [
                'flujos' => collect($flujos)->map(function ($flujo) {
                    return self::formatFlujo($flujo);
                })->values()
            ]
        ]);
    }

    public static function flujo($flujo): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Flujo obtenido exitosamente',
            'data' => [
                'flujo' => self::formatFlujo($flujo)
            ]
        ]);
    }

    public static function etapaOsubEtapaCambiada(?Flujo $flujo): JsonResponse
    {
        if ($flujo) {
            return response()->json([
                'success' => true,
                'message' => 'Etapa y subetapa cambiadas exitosamente',
                'data' => [
                    'flujo' => self::formatFlujo($flujo)
                ]
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo crear el nuevo flujo',
                'data' => null
            ], 500);
        }
    }

    public static function formatFlujo($flujo): array
    {
        return [
            'id_flujo' => $flujo->id_flujo,
            'id_expediente' => $flujo->id_expediente,
            'estado' => $flujo->estado,
            'fecha_inicio' => $flujo->fecha_inicio,
            'fecha_limite' => $flujo->fecha_limite,
            'fecha_fin' => $flujo->fecha_fin,
            'etapa' => $flujo->etapa ? [
                'id_etapa' => $flujo->etapa->id_etapa,
                'nombre' => $flujo->etapa->nombre,
            ] : null,
            'subetapa' => $flujo->subetapa ? [
                'id_sub_etapa' => $flujo->subetapa->id_sub_etapa,
                'nombre' => $flujo->subetapa->nombre,
            ] : null,
        ];
    }

    public static function cambioEtapaSubetapa(array $resultado): JsonResponse
    {
        if ($resultado['success']) {
            return response()->json([
                'success' => true,
                'message' => $resultado['message'],
                'data' => [
                    'flujo' => $resultado['data'] ? self::formatFlujo($resultado['data']) : null
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


}