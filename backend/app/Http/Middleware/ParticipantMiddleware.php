<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ParticipantMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('api')->user();
        
        // Participantes: Demandante(4), Demandado(5)
        if (!$user || !in_array($user->id_rol, [4, 5])) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado. Solo participantes del proceso.'
            ], 403);
        }

        return $next($request);
    }
}
