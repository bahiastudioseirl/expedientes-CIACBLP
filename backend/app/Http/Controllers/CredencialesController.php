<?php

namespace App\Http\Controllers;

use App\Services\Expediente\CredencialesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CredencialesController extends Controller
{
    public function __construct(
        private readonly CredencialesService $credencialesService
    ) {}

    public function enviarCredencialesDemandado(int $idExpediente, Request $request): JsonResponse
    {
        try {
            $usuarioAutenticado = Auth::user();
            
            if (!$usuarioAutenticado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }
            
            $mensaje = $request->input('mensaje', '');
            $adjuntos = $request->file('adjuntos', []);
            $idUsuarioRemitente = $usuarioAutenticado->id_usuario;
            
            // Enviar credenciales CON mensaje y adjuntos
            $resultado = $this->credencialesService->enviarCredencialesDemandado(
                $idExpediente,
                $mensaje,
                $adjuntos,
                $idUsuarioRemitente
            );
            
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

    public function obtenerDestinatariosCredenciales(int $idExpediente): JsonResponse
    {
        try {
            $destinatarios = $this->credencialesService->obtenerDestinatariosParaCredenciales($idExpediente);
            
            return response()->json([
                'success' => true,
                'data' => $destinatarios,
                'message' => 'Destinatarios obtenidos exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener destinatarios: ' . $e->getMessage()
            ], 500);
        }
    }
}