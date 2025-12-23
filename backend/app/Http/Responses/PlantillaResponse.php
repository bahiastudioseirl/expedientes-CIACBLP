<?php

namespace App\Http\Responses;

use App\Models\Plantilla;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\JsonResponse;

class PlantillaResponse
{
    public static function plantillaCreada(Plantilla $plantilla): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Plantilla creada exitosamente',
            'data' => [
                'plantilla' => self::formatPlantilla($plantilla)
            ]
        ], 201);
    }

    public static function plantillaActualizada(Plantilla $plantilla): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Plantilla actualizada exitosamente',
            'data' => [
                'plantilla' => self::formatPlantilla($plantilla)
            ]
        ]);
    }

    public static function plantilla(Plantilla $plantilla): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Plantilla obtenida exitosamente',
            'data' => [
                'plantilla' => self::formatPlantilla($plantilla)
            ]
        ]);
    }

    public static function plantillas(Collection $plantillas): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Plantillas obtenidas exitosamente',
            'data' => [
                'plantillas' => $plantillas->map(function ($plantilla) {
                    return self::formatPlantilla($plantilla);
                })
            ]
        ]);
    }

    public static function plantillaEliminada(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Plantilla eliminada exitosamente'
        ]);
    }

    public static function plantillaEstadoCambiado(Plantilla $plantilla): JsonResponse
    {
        $estado = $plantilla->activo ? 'activada' : 'desactivada';
        return response()->json([
            'success' => true,
            'message' => "Plantilla {$estado} exitosamente",
            'data' => [
                'plantilla' => self::formatPlantilla($plantilla)
            ]
        ]);
    }

    private static function formatPlantilla(Plantilla $plantilla): array
    {
        return [
            'id_plantilla' => $plantilla->id_plantilla,
            'nombre' => $plantilla->nombre,
            'activo' => (bool) $plantilla->activo,
            'etapas' => $plantilla->etapas?->map(function ($etapa) {
                return [
                    'id_etapa' => $etapa->id_etapa,
                    'nombre' => $etapa->nombre,
                    'sub_etapas' => $etapa->subEtapas?->map(function ($subEtapa) {
                        return [
                            'id_sub_etapa' => $subEtapa->id_sub_etapa,
                            'nombre' => $subEtapa->nombre,
                            'tiene_tiempo' => (bool) $subEtapa->tiene_tiempo,
                            'duracion_dias' => $subEtapa->duracion_dias,
                            'es_opcional' => (bool) $subEtapa->es_opcional,
                            'created_at' => $subEtapa->created_at?->format('Y-m-d H:i:s'),
                            'updated_at' => $subEtapa->updated_at?->format('Y-m-d H:i:s')
                        ];
                    }) ?? []
                ];
            }) ?? [],
            'created_at' => $plantilla->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $plantilla->updated_at?->format('Y-m-d H:i:s')
        ];
    }
}