<?php

namespace App\Http\Controllers;

use App\DTOs\Expedientes\CrearExpedienteDTO;
use App\Http\Requests\Expedientes\CrearExpedienteRequest;
use App\Http\Responses\ExpedienteResponse;
use App\Services\ExpedienteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpedienteController extends Controller
{
    public function __construct(
        private readonly ExpedienteService $expedienteService
    ){}

    public function crearExpedienteDesdeAdmitida(CrearExpedienteRequest $request, int $idSolicitud): JsonResponse
    {
        try {
            $dto = CrearExpedienteDTO::fromRequest(
                array_merge($request->validated(), ['id_solicitud' => $idSolicitud])
            );
            
            $expediente = $this->expedienteService->crearDesdeSolicitud($dto);
            
            return ExpedienteResponse::expedienteCreado($expediente);
            
        } catch (\Exception $e) {
            return ExpedienteResponse::error(
                'Error al crear el expediente: ' . $e->getMessage(),
                500
            );
        }
    }

    public function obtenerExpediente(int $idExpediente): JsonResponse
    {
        try {
            $expediente = $this->expedienteService->obtenerPorId($idExpediente);
            
            if (!$expediente) {
                return ExpedienteResponse::error('Expediente no encontrado', 404);
            }
            
            return ExpedienteResponse::expediente($expediente);
            
        } catch (\Exception $e) {
            return ExpedienteResponse::error(
                'Error al obtener el expediente: ' . $e->getMessage(),
                500
            );
        }
    }

    public function listarExpedientes(): JsonResponse
    {
        try {
            $expedientes = $this->expedienteService->obtenerTodos();
            
            return ExpedienteResponse::expedientes($expedientes);
            
        } catch (\Exception $e) {
            return ExpedienteResponse::error(
                'Error al listar los expedientes: ' . $e->getMessage(),
                500
            );
        }
    }

    public function listarMisExpedientes(Request $request): JsonResponse
    {
        try {
            // Obtener usuario autenticado desde el middleware JWT
            $usuario = auth('api')->user();
            
            if (!$usuario) {
                return ExpedienteResponse::error('Usuario no autenticado', 401);
            }
            
            // Obtener expedientes según el rol del usuario
            $expedientes = $this->expedienteService->obtenerPorRolUsuario(
                $usuario->id_usuario,
                $usuario->id_rol
            );
            
            return ExpedienteResponse::expedientes($expedientes);
            
        } catch (\Exception $e) {
            return ExpedienteResponse::error(
                'Error al obtener mis expedientes: ' . $e->getMessage(),
                500
            );
        }
    }

    public function obtenerParticipantes(int $idExpediente): JsonResponse
    {
        try {
            $participantes = $this->expedienteService->obtenerParticipantes($idExpediente);
            
            return response()->json([
                'success' => true,
                'data' => $participantes,
                'message' => 'Participantes obtenidos exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return ExpedienteResponse::error(
                'Error al obtener participantes: ' . $e->getMessage(),
                500
            );
        }
    }

    public function finalizarExpediente(int $idExpediente): JsonResponse
    {
        try {
            $exito = $this->expedienteService->finalizarExpediente($idExpediente);
            
            if ($exito) {
                return response()->json([
                    'success' => true,
                    'message' => 'Expediente finalizado exitosamente'
                ]);
            } else {
                return ExpedienteResponse::error('No se pudo finalizar el expediente', 400);
            }
            
        } catch (\Exception $e) {
            return ExpedienteResponse::error(
                'Error al finalizar el expediente: ' . $e->getMessage(),
                500
            );
        }
    }


}