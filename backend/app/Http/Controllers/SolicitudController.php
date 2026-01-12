<?php

namespace App\Http\Controllers;

use App\DTOs\Solicitudes\CrearSolicitudDTO;
use App\Http\Requests\Solicitud\CrearSolicitudRequest;
use App\Http\Responses\SolicitudResponse;
use App\Services\SolicitudService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class SolicitudController extends Controller
{
    public function __construct(
        private SolicitudService $solicitudService
    ) {}

    public function crear(CrearSolicitudRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $usuario = $request->user();
            
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }
            
            $validated['id_usuario_solicitante'] = (int) $usuario->id_usuario_solicitante;
            
            $dto = CrearSolicitudDTO::fromRequest($validated);
            $solicitud = $this->solicitudService->crear($dto, (int) $usuario->id_usuario_solicitante);
            
            return SolicitudResponse::crear($solicitud);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear la solicitud: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la solicitud',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarTodas(): JsonResponse
    {
        try {
            $solicitudes = $this->solicitudService->listarTodas();
            if($solicitudes->isEmpty()){
                return response()->json([
                    'success' => false,
                    'message' => 'No hay solicitudes registradas'
                ], 404);
            }
            return SolicitudResponse::solicitudes($solicitudes);
        } catch (\Exception $e) {
            Log::error('Error al listar las solicitudes: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al listar las solicitudes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function admitirSolicitud(int $id): JsonResponse
    {
        try {
            $exito = $this->solicitudService->admitirSolicitud($id);
            if ($exito) {
                return response()->json([
                    'success' => true,
                    'message' => 'Solicitud admitida exitosamente'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo admitir la solicitud'
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Error al admitir la solicitud: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al admitir la solicitud',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}