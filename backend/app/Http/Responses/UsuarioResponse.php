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

        // Campos base
        $data = [
            'id_usuario' => $usuario->id_usuario,
            'numero_documento' => $usuario->numero_documento,
        ];

        // Nombre / Apellido o Empresa
        if (in_array($rolId, [4, 5])) {
            $data['nombre_empresa'] = $usuario->nombre_empresa ?? null;
        } else {
            $data['nombre'] = $usuario->nombre;
            $data['apellido'] = $usuario->apellido;
        }

        // Resto de campos
        $data += [
            'telefono' => $usuario->telefono,
            'activo' => (bool) $usuario->activo,
            'correos' => $usuario->correos?->map(function ($correo) {
                return [
                    'id_correo' => $correo->id_correo,
                    'direccion' => $correo->direccion
                ];
            })->values() ?? [],
            'rol' => [
                'id' => $rolId,
                'nombre' => $usuario->rol->nombre ?? null
            ],
            'created_at' => $usuario->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $usuario->updated_at?->format('Y-m-d H:i:s'),
        ];

        return $data;
    }
}
