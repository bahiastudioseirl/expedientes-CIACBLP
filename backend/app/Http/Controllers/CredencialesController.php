<?php

namespace App\Http\Controllers;

use App\Services\Expediente\CredencialesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CredencialesController extends Controller
{
    public function __construct(
        private readonly CredencialesService $credencialesService
    ) {}

    public function enviarCredencialesDemandado(int $idExpediente, Request $request): JsonResponse
    {
        try {
            // Solo enviar credenciales, no manejar mensajes aquí
            $resultado = $this->credencialesService->enviarCredencialesDemandado($idExpediente);
            
            return response()->json($resultado);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar credenciales: ' . $e->getMessage()
            ], 500);
        }
    }

    public function puedeEnviarCredenciales(int $idExpediente): JsonResponse
    {
        try {
            $puede = $this->credencialesService->puedeEnviarCredenciales($idExpediente);
            
            return response()->json([
                'success' => true,
                'data' => ['puede_enviar' => $puede],
                'message' => 'Verificación realizada exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar credenciales: ' . $e->getMessage()
            ], 500);
        }
    }
}