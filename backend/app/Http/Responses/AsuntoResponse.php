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
                    return self::formatAsunto($asunto);
                })
            ]
        ]);

    }


    public static function formatAsunto($asunto): array
    {
        return [
            'id_asunto' => $asunto->id_asunto,
            'id_expediente' => $asunto->id_expediente,
            'titulo' => $asunto->titulo,
            'activo' => (bool) $asunto->activo,
        ];
    }
}