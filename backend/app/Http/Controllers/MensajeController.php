<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mensajes\CrearMensajeRequest;
use App\Http\Responses\MensajeResponse;
use App\DTOs\Mensajes\CrearMensajeDTO;
use App\Services\MensajeService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class MensajeController extends Controller
{
    public function __construct(
        private readonly MensajeService $mensajeService
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
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje: ' . $e->getMessage()
            ], 500);
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
}