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

}