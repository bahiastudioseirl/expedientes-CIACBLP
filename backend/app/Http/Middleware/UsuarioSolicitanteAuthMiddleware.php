<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UsuarioSolicitanteAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token de acceso requerido'
                ], 401);
            }

            JWTAuth::setToken($token);
            
            $payload = JWTAuth::getPayload();
            $userId = $payload->get('sub');
            $tipoUsuario = $payload->get('tipo_usuario');
            
            // Verificar que sea un usuario solicitante
            if ($tipoUsuario !== 'solicitante') {
                return response()->json([
                    'success' => false,
                    'message' => 'Acceso denegado. Solo usuarios solicitantes pueden acceder'
                ], 403);
            }
            
            $usuario = \App\Models\UsuarioSolicitante::where('id_usuario_solicitante', $userId)->first();
            
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario solicitante no encontrado'
                ], 401);
            }

            // Establecer el usuario solicitante en el contexto de la petición
            $request->attributes->set('usuario_solicitante', $usuario);
            
            $request->setUserResolver(function () use ($usuario) {
                return $usuario;
            });
            
            return $next($request);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido',
                'error' => $e->getMessage()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de autenticación',
                'error' => $e->getMessage()
            ], 401);
        }
    }
}