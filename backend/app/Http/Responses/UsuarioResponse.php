<?php

namespace App\Http\Responses;

use App\Models\Usuarios;
use Symfony\Component\HttpFoundation\JsonResponse;

class UsuarioResponse
{

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

    public static function perfilActualizado(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado exitosamente',
            'data' => [
                'usuario' => [
                    'id' => $usuario->id_usuario,
                    'id_usuario' => $usuario->id_usuario,
                    'nombre_completo' => $usuario->nombre_completo,
                    'correo' => $usuario->correo,
                    'rol' => $usuario->rol->nombre ?? ''
                ]
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
                'nombre' => $usuario->rol->nombre ?? null,
                'created_at' => $usuario->rol->created_at->toDateTimeString(),
                'updated_at' => $usuario->rol->updated_at->toDateTimeString(),
            ],
            'created_at' => $usuario->created_at->toDateTimeString(),
            'updated_at' => $usuario->updated_at->toDateTimeString(),
        ];
        return $data;
    }


    public static function participantesExpediente(array $data): JsonResponse
    {
        $demandantesFormateados = collect($data['demandantes'])->map(function ($usuario) {
            return self::format($usuario);
        })->values()->toArray();

        $demandadosFormateados = collect($data['demandados'])->map(function ($usuario) {
            return self::format($usuario);
        })->values()->toArray();

        return response()->json([
            'success' => true,
            'message' => 'Participantes del expediente obtenidos exitosamente',
            'data' => [
                'demandantes' => $demandantesFormateados,
                'demandados' => $demandadosFormateados,
                'total' => $data['total']
            ]
        ]);
    }

    public static function usuarioCreadoAgregadoExpediente(array $data): JsonResponse
    {
        $usuario = $data['usuario_creado'] ?? null;
        if ($usuario && is_array($usuario)) {
            unset($usuario['contrasena']);
        }
        return response()->json([
            'success' => true,
            'message' => 'Usuario creado y agregado al expediente exitosamente. Credenciales enviadas por correo.',
            'data' => [
                'usuario' => $usuario,
                'correo_agregado' => $data['correo_agregado'] ?? null,
                'tipo_parte' => $data['tipo_parte'] ?? null,
                'solicitud_parte_id' => $data['solicitud_parte_id'] ?? null
            ]
        ], 201);
    }


    public static function usuarioCreado(Usuarios $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente. Credenciales enviadas por correo.',
            'data' => [
                'usuario' => self::format($usuario)
            ]
        ], 201);
    }

    public static function staffVinculado(array $datos): JsonResponse
    {
        $usuario = $datos['usuario'];
        $expediente = $datos['expediente'];
        
        return response()->json([
            'success' => true,
            'message' => $usuario->rol?->nombre . ' vinculado exitosamente al expediente',
            'data' => [
                'usuario' => [
                    'id' => $usuario->id_usuario,
                    'nombre_completo' => $usuario->nombre_completo,
                    'correo' => $usuario->correo,
                    'rol' => $usuario->rol?->nombre
                ],
                'expediente' => [
                    'id' => $expediente->id_expediente,
                    'codigo' => $expediente->codigo_expediente
                ]
            ]
        ]);
    }

    public static function staffExpediente($usuarios): JsonResponse
    {
        $formateados = collect($usuarios)->map(function ($usuario) {
            return [
                'id_usuario' => $usuario->id_usuario,
                'nombre_completo' => $usuario->nombre_completo,
                'correo' => $usuario->correo,
                'telefono' => $usuario->telefono,
                'rol' => $usuario->rol?->nombre
            ];
        })->values()->toArray();

        return response()->json([
            'success' => true,
            'message' => 'Staff del expediente obtenido exitosamente',
            'data' => [
                'usuarios' => $formateados
            ]
        ]);
    }
}
