<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StaffMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('api')->user();
        
        // Staff: Administrador(1), Árbitro(2), Secretario(3)
        if (!$user || !in_array($user->id_rol, [1, 2, 3])) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado. Se requieren permisos de staff.'
            ], 403);
        }

        return $next($request);
    }
}
