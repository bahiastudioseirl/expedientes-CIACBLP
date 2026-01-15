<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mensajes\CrearMensajeRequest;
use App\Http\Responses\MensajeResponse;
use App\DTOs\Mensajes\CrearMensajeDTO;
use App\Services\MensajeService;
use App\Services\Expediente\CredencialesService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Support\Facades\Log;

class MensajeController extends Controller
{
    
    public function __construct(
        private readonly MensajeService $mensajeService,
        private readonly CredencialesService $credencialesService
    ) {}

    public function crearMensaje(CrearMensajeRequest $request): JsonResponse
    {
        try {
            $idUsuario = auth('api')->user()->id_usuario;
            
            $datos = CrearMensajeDTO::fromRequest($request->validated(), $idUsuario);
            
            $usuariosDestinatarios = $request->input('usuarios_destinatarios', []);
            $adjuntos = $request->file('adjuntos', []);

            $mensaje = $this->mensajeService->crearMensaje($datos, $usuariosDestinatarios, $adjuntos);

            return MensajeResponse::mensajeCreado($mensaje);

        } catch (\Exception $e) {
            return $this->handleGeneralError('Error al enviar el mensaje', $e);
        }
    }

    public function listarMensajesPorAsunto(int $idAsunto): JsonResponse
    {
        try {
            $usuario = auth('api')->user();
            $esAdmin = $usuario->rol->nombre === 'Administrador';

            if ($esAdmin) {
                $mensajes = $this->mensajeService->obtenerMensajesPorAsunto($idAsunto);
            } else {
                $mensajes = $this->mensajeService->obtenerMensajesPorAsuntoYUsuario($idAsunto, $usuario->id_usuario);
            }

            return MensajeResponse::mensajes($mensajes);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener mensajes: ' . $e->getMessage()
            ], 500);
        }
    }

    public function marcarMensajeComoLeido(int $idMensaje): JsonResponse
    {
        try {
            $usuario = auth('api')->user();
            $resultado = $this->mensajeService->marcarMensajeComoLeido($idMensaje, $usuario->id_usuario);

            if ($resultado) {
                return MensajeResponse::marcarComoLeido(true);
            }
            return MensajeResponse::marcarComoLeido(false);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar el mensaje como leído: ' . $e->getMessage()
            ], 500);
        }
    }

    public function responderMensaje(CrearMensajeRequest $request, int $idMensajePadre): JsonResponse
    {
        try {
            $idUsuario = auth('api')->user()->id_usuario;
            
            $datos = CrearMensajeDTO::fromRequest($request->validated(), $idUsuario);
            
            $usuariosDestinatarios = $request->input('usuarios_destinatarios', []);
            $adjuntos = $request->file('adjuntos', []);

            $respuesta = $this->mensajeService->responderMensaje($idMensajePadre, $datos, $usuariosDestinatarios, $adjuntos);

            return MensajeResponse::mensajeCreado($respuesta);

        } catch (\Exception $e) {
            return $this->handleGeneralError('Error al responder el mensaje', $e);
        }
    }

    public function obtenerHiloMensaje(int $idMensaje): JsonResponse
    {
        try {
            $hiloCompleto = $this->mensajeService->obtenerHiloCompleto($idMensaje);
            
            $mensajesFormateados = $hiloCompleto->map(function ($mensaje) {
                if (!$mensaje->relationLoaded('usuario')) {
                    $mensaje->load('usuario');
                }
                if (!$mensaje->relationLoaded('adjuntos')) {
                    $mensaje->load('adjuntos');
                }
                if (!$mensaje->relationLoaded('asunto')) {
                    $mensaje->load('asunto');
                }
                
                return MensajeResponse::formatMensaje($mensaje);
            });

            return response()->json([
                'success' => true,
                'data' => $mensajesFormateados
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el hilo del mensaje: ' . $e->getMessage()
            ], 500);
        }
    }

    private function handleGeneralError(string $baseMessage, \Exception $exception): JsonResponse
    {
        Log::error($baseMessage . ': ' . $exception->getMessage(), [
            'exception' => $exception,
            'user_id' => auth('api')->id(),
            'trace' => $exception->getTraceAsString()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => $baseMessage . ': ' . $exception->getMessage()
        ], 500);
    }

    public function enviarCredencialesDemandado(int $idExpediente, Request $request): JsonResponse
    {
        try {
            $usuario = auth('api')->user();
            
            // Solo secretarios, administradores y árbitros pueden enviar credenciales
            if (!in_array($usuario->rol->nombre, ['Administrador', 'Secretario', 'Arbitro'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para enviar credenciales'
                ], 403);
            }

            // Obtener mensaje opcional del request
            $mensaje = $request->input('mensaje', '');

            $resultado = $this->credencialesService->enviarCredencialesDemandado($idExpediente, $mensaje);

            if ($resultado['success']) {
                return response()->json($resultado, 200);
            } else {
                return response()->json($resultado, 400);
            }

        } catch (\Exception $e) {
            return $this->handleGeneralError('Error al enviar credenciales', $e);
        }
    }

    public function verificarCredencialesDisponibles(int $idExpediente): JsonResponse
    {
        try {
            $usuario = auth('api')->user();
            
            // Solo secretarios, administradores y árbitros pueden verificar
            if (!in_array($usuario->rol->nombre, ['Administrador', 'Secretario', 'Arbitro'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para verificar credenciales'
                ], 403);
            }

            $puedeEnviar = $this->credencialesService->puedeEnviarCredenciales($idExpediente);

            return response()->json([
                'success' => true,
                'data' => [
                    'puede_enviar_credenciales' => $puedeEnviar
                ]
            ]);

        } catch (\Exception $e) {
            return $this->handleGeneralError('Error al verificar credenciales', $e);
        }
    }
}