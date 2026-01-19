<?php

namespace App\Http\Controllers;

use App\Services\Expediente\CredencialesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            
            Log::info("=== INICIO ENVÍO CREDENCIALES ===");
            Log::info("ID Expediente: {$idExpediente}");
            Log::info("Usuario autenticado: " . ($usuarioAutenticado ? $usuarioAutenticado->id_usuario : 'NO AUTENTICADO'));
            Log::info("Datos recibidos - Mensaje: " . (strlen($request->input('mensaje', '')) > 0 ? 'SÍ' : 'NO'));
            Log::info("Datos recibidos - Adjuntos: " . ($request->hasFile('adjuntos') ? count($request->file('adjuntos', [])) : 0) . ' archivo(s)');
            
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
            
            Log::info("Resultado: " . ($resultado['success'] ? 'EXITOSO' : 'FALLÓ'));
            Log::info("=== FIN ENVÍO CREDENCIALES ===");
            
            return response()->json($resultado);
            
        } catch (\Exception $e) {
            Log::error("ERROR en enviarCredencialesDemandado: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            
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