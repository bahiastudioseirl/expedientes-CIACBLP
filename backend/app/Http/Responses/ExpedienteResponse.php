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
                'id' => $expediente->id_expediente,
                'codigo_expediente' => $expediente->codigo_expediente,
                'id_solicitud' => $expediente->id_solicitud,
                'id_plantilla' => $expediente->id_plantilla,
                'activo' => $expediente->activo,
                'created_at' => $expediente->created_at->toISOString(),
            ]
        ], 201);
    }

    public static function error(string $mensaje, int $codigo = 500): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $mensaje,
        ], $codigo);
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

    public static function formatExpediente(Expediente $expediente)
    {

    }
}
