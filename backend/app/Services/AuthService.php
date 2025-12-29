<?php

namespace App\Services;

use App\Models\Usuarios;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function iniciarSesion(string $numero_documento, string $contrasena): array
    {
        // Verificar credenciales
        $usuario = Usuarios::where('numero_documento', $numero_documento)->first();
        
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
        $userData = [
            'id' => $usuario->id_usuario,
            'numero_documento' => $usuario->numero_documento,
            'rol' => $rolNombre
        ];
        if (in_array(strtolower($rolNombre), ['demandante', 'demandado'])) {
            $userData['nombre_empresa'] = $usuario->nombre_empresa;
        } else {
            $userData['nombre'] = $usuario->nombre;
            $userData['apellido'] = $usuario->apellido;
        }
        return [
            'success' => true,
            'message' => 'Autenticación exitosa',
            'token' => $token,
            'user' => $userData
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