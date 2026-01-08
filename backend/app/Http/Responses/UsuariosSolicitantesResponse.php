<?php

namespace App\Http\Responses;

use App\Models\UsuarioSolicitante;
use Illuminate\Http\JsonResponse;

class UsuariosSolicitantesResponse
{
    public static function registroExitoso(UsuarioSolicitante $usuario): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado exitosamente. Se ha enviado un código de verificación a su correo.',
            'data' => [
                'usuario' => self::formatUsuario($usuario)
            ]
        ], 201);
    }

    public static function autenticacion(UsuarioSolicitante $usuario, string $token): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Autenticación exitosa',
            'data' => [
                'usuario' => self::formatUsuario($usuario),
                'token' => $token,
                'token_type' => 'bearer'
            ]
        ], 200);
    }

    public static function codigoRenviado(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Código de verificación reenviado exitosamente'
        ], 200);
    }

    public static function usuarioNoEncontrado(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Usuario no encontrado'
        ], 404);
    }

    public static function codigoInvalido(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Código inválido o expirado'
        ], 400);
    }

    public static function error(string $message = 'Error interno del servidor', int $status = 500): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $status);
    }

    private static function formatUsuario(UsuarioSolicitante $usuario): array
    {
        return [
            'id_usuario_solicitante' => $usuario->id_usuario_solicitante,
            'nombre_completo' => $usuario->nombre_completo,
            'numero_documento' => $usuario->numero_documento,
            'correo' => $usuario->correo
        ];
    }
}