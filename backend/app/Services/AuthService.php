<?php

namespace App\Services;

use App\Models\Usuarios;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function iniciarSesion(string $correo, string $contrasena): array
    {
        $usuario = Usuarios::where('correo', $correo)->first();
        
        if (!$usuario || !Hash::check($contrasena, $usuario->contrasena)) {
            return [
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ];
        }
        
        if (!$usuario->activo) {
            return [
                'success' => false,
                'message' => 'Usuario desactivado'
            ];
        }
        
        // Generar JWT directamente
        $token = JWTAuth::fromUser($usuario);
        
        $rolNombre = $usuario->rol->nombre ?? null;
        return [
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => [
                'token' => $token,
                'usuario' => [
                    'id_usuario' => $usuario->id_usuario,
                    'nombre_completo' => $usuario->nombre_completo,
                    'correo' => $usuario->correo,
                    'rol' => $rolNombre
                ]
            ]
        ];
    }
    public function cerrarSesion(): array
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return [
                'success' => true,
                'message' => 'Sesión cerrada exitosamente'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al cerrar sesión'
            ];
        }
    }
}