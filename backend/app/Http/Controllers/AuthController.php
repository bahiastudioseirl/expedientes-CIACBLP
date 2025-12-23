<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}


    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->iniciarSesion(
                $request->validated()['numero_documento'],
                $request->validated()['contrasena']
            );

            return response()->json($result, $result['success'] ? 200 : 401);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            $result = $this->authService->cerrarSesion();

            return response()->json($result, $result['success'] ? 200 : 400);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión'
            ], 500);
        }
    }

    public function me(): JsonResponse
    {
        try {
            $user = auth('api')->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id_usuario,
                    'nombre' => $user->nombre,
                    'apellido' => $user->apellido,
                    'numero_documento' => $user->numero_documento,
                    'rol' => $user->rol->nombre ?? null
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }
}
