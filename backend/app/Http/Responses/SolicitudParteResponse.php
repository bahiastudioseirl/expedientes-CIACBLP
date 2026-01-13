<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class SolicitudParteResponse
{
    public static function datosPartes($demandante, $demandado): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'demandante' => self::formatearDatosParte($demandante),
                'demandado' => self::formatearDatosParte($demandado)
            ]
        ]);
    }

    private static function formatearDatosParte($parte): ?array
    {
        if (!$parte) {
            return null;
        }

        $correos = $parte->correos->map(function ($correo) {
            return [
                'correo' => $correo->correo,
                'es_principal' => $correo->es_principal,
            ];
        });

        $correoPrincipal = $correos->where('es_principal', true)->first();

        return [
            'nombre_razon' => $parte->nombre_razon,
            'numero_documento' => $parte->numero_documento,
            'correos' => [
                'principal' => $correoPrincipal ? $correoPrincipal['correo'] : null,
                'todos' => $correos->toArray(),
            ],
            'telefono' => $parte->telefono,

        ];
    }
}
