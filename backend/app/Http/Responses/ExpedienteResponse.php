<?php

namespace App\Http\Responses;

use App\Models\Expediente;
use App\Models\UsuarioExpediente;
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

    public static function arbitroVinculado(array $data): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $data['mensaje'],
            'data' => [
                'usuario_existente' => $data['usuario_existente'],
                'nombre_completo' => $data['nombre_completo'],
                'correo' => $data['correo'],
                'telefono' => $data['telefono'],
                'numero_documento' => $data['numero_documento'],
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
        $partes = $expediente->solicitud?->partes()->with('correos')->get() ?? collect();
        $usuariosExpediente = self::getUsuariosExpediente($expediente->id_expediente);

        return [
            'id' => $expediente->id_expediente,
            'codigo_expediente' => $expediente->codigo_expediente,
            'id_solicitud' => $expediente->id_solicitud,
            'id_plantilla' => $expediente->id_plantilla,
            'activo' => $expediente->activo,
            'created_at' => $expediente->created_at?->toISOString(),
            'demandante' => self::formatPartes($partes, 'demandante'),
            'demandado' => self::formatPartes($partes, 'demandado'),
            'secretario' => self::formatUsuario(self::getUsuarioPorRol($usuariosExpediente, 'secretario')),
            'arbitro' => self::formatUsuario(self::getUsuarioPorRol($usuariosExpediente, 'arbitro')),
        ];
    }

    private static function formatPartes($partes, string $tipo): array
    {
        return $partes
            ->where('tipo', $tipo)
            ->map(fn($parte) => [
                'nombre_razon' => $parte->nombre_razon,
                'numero_documento' => $parte->numero_documento,
                'telefono' => $parte->telefono,
                'correos' => $parte->correos->pluck('correo')->toArray(),
            ])
            ->values()
            ->all();
    }

    private static function getUsuariosExpediente(int $idExpediente)
    {
        return UsuarioExpediente::where('id_expediente', $idExpediente)
            ->with(['usuario.rol'])
            ->get();
    }

    private static function getUsuarioPorRol($usuariosExpediente, string $rolNombre)
    {
        return $usuariosExpediente->first(function ($ue) use ($rolNombre) {
            return $ue->usuario?->rol && 
                   (strtolower($ue->usuario->rol->nombre) === strtolower($rolNombre) ||
                    $ue->usuario->id_rol === 3 && strtolower($rolNombre) === 'secretario');
        });
    }

    private static function formatUsuario($usuarioExpediente): ?array
    {
        if (!$usuarioExpediente?->usuario) {
            return null;
        }

        $usuario = $usuarioExpediente->usuario;
        
        return [
            'id' => $usuario->id_usuario,
            'nombre_completo' => $usuario->nombre_completo,
            'correo' => $usuario->correo,
            'telefono' => $usuario->telefono,
        ];
    }
}
