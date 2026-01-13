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

    public static function formatExpediente(Expediente $expediente)
    {

    }
}
