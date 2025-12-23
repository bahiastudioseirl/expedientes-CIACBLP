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
                'usuario' => [
                    'id_usuario' => $usuario->id_usuario,
                    'nombre' => $usuario->nombre,
                    'apellido' => $usuario->apellido,
                    'tipo_documento' => $usuario->tipo_documento,
                    'numero_documento' => $usuario->numero_documento,
                    'correo' => $usuario->correo,
                    'telefono' => $usuario->telefono,
                    'activo' => (bool) $usuario->activo,
                    'rol' => [
                        'id' => $usuario->rol->id_rol ?? null,
                        'nombre' => $usuario->rol->nombre ?? null
                    ],
                    'created_at' => $usuario->created_at?->format('Y-m-d H:i:s'),
                    'updated_at' => $usuario->updated_at?->format('Y-m-d H:i:s')
                ]
            ]
        ], 201);
    }

    public static function usuarioActualizado(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente',
            'data' => [
                'usuario' => [
                    'id_usuario' => $usuario->id_usuario,
                    'nombre' => $usuario->nombre,
                    'apellido' => $usuario->apellido,
                    'tipo_documento' => $usuario->tipo_documento,
                    'numero_documento' => $usuario->numero_documento,
                    'correo' => $usuario->correo,
                    'telefono' => $usuario->telefono,
                    'activo' => (bool) $usuario->activo,
                    'rol' => [
                        'id' => $usuario->rol->id_rol ?? null,
                        'nombre' => $usuario->rol->nombre ?? null
                    ],
                    'created_at' => $usuario->created_at?->format('Y-m-d H:i:s'),
                    'updated_at' => $usuario->updated_at?->format('Y-m-d H:i:s')
                ]
            ]
        ]);
    }

    public static function usuario(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'usuario' => [
                    'id_usuario' => $usuario->id_usuario,
                    'nombre' => $usuario->nombre,
                    'apellido' => $usuario->apellido,
                    'tipo_documento' => $usuario->tipo_documento,
                    'numero_documento' => $usuario->numero_documento,
                    'correo' => $usuario->correo,
                    'telefono' => $usuario->telefono,
                    'activo' => (bool) $usuario->activo,
                    'rol' => [
                        'id' => $usuario->rol->id_rol ?? null,
                        'nombre' => $usuario->rol->nombre ?? null
                    ],
                    'created_at' => $usuario->created_at?->format('Y-m-d H:i:s'),
                    'updated_at' => $usuario->updated_at?->format('Y-m-d H:i:s')
                ]
            ]
        ]);
    }

    public static function usuarios($usuarios): JsonResponse
    {
        $usuariosData = $usuarios->map(function($usuario) {
            return [
                'id_usuario' => $usuario->id_usuario,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'tipo_documento' => $usuario->tipo_documento,
                'numero_documento' => $usuario->numero_documento,
                'correo' => $usuario->correo,
                'telefono' => $usuario->telefono,
                'activo' => (bool) $usuario->activo,
                'rol' => [
                    'id' => $usuario->rol->id_rol ?? null,
                    'nombre' => $usuario->rol->nombre ?? null
                ],
                'created_at' => $usuario->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $usuario->updated_at?->format('Y-m-d H:i:s')
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'usuarios' => $usuariosData
            ]
        ]);
    }
}