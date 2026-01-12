<?php

namespace App\Http\Responses;

use App\Models\Usuarios;
use Symfony\Component\HttpFoundation\JsonResponse;

class UsuarioResponse
{
    public static function usuarioCreado(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data' => [
                'usuario' => self::format($usuario)
            ]
        ], 201);
    }

    public static function usuarioActualizado(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data' => [
                'usuario' => self::format($usuario)
            ]
        ]);
    }


    public static function usuario(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario obtenido exitosamente',
            'data' => [
                'usuario' => self::format($usuario)
            ]
        ]);
    }

    public static function usuarios($usuarios): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuarios obtenidos exitosamente',
            'data' => [
                'usuarios' => $usuarios->map(function ($usuario) {
                    return self::format($usuario);
                })->values()
            ]
        ]);
    }



    public static function format(Usuarios $usuario): array
    {
        $rolId = $usuario->rol->id_rol ?? null;

        $data = [
            'id_usuario' => $usuario->id_usuario,
            'nombre_completo' => $usuario->nombre_completo,
            'numero_documento' => $usuario->numero_documento,
            'correo' => $usuario->correo,
            'telefono' => $usuario->telefono,
            'activo' => (bool) $usuario->activo,
            'rol' => [
                'id_rol' => $rolId,
                'nombre' => $usuario->rol->nombre ?? null
            ]
        ];
        return $data;
    }
}
