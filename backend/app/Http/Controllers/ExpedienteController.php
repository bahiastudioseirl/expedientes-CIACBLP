<?php

namespace App\Http\Controllers;

use App\DTOs\Expedientes\CrearExpedienteDTO;
use App\DTOs\Expedientes\ActualizarExpedienteDTO;
use App\Http\Requests\Expedientes\CrearExpedienteRequest;
use App\Http\Requests\Expedientes\ActualizarExpedienteRequest;
use App\Http\Responses\ExpedienteResponse;
use App\Services\ExpedienteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ExpedienteController extends Controller
{
    public function __construct(
        private readonly ExpedienteService $expedienteService
    ){}

    public function crearExpediente(CrearExpedienteRequest $request): JsonResponse
    {
        try {
            // Obtener usuario del JWT
            $usuario = auth('api')->user();
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $dto = CrearExpedienteDTO::fromRequest($request->validated(), $usuario->id_usuario);
            $resultado = $this->expedienteService->crearExpediente($dto);
            
            return ExpedienteResponse::expedienteCreado(
                $resultado['expediente'], 
                $resultado['usuarios_info']
            );
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function actualizarExpediente(ActualizarExpedienteRequest $request, $id): JsonResponse
    {
        try {
            // Obtener usuario del JWT
            $usuario = auth('api')->user();
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }

            $dto = ActualizarExpedienteDTO::fromRequest($request->validated(), $id, $usuario->id_usuario);
            $resultado = $this->expedienteService->actualizarExpediente($dto);
            
            return response()->json([
                'success' => true,
                'message' => 'Expediente actualizado exitosamente',
                'data' => [
                    'expediente' => ExpedienteResponse::formatExpediente($resultado['expediente']),
                    'usuarios_info' => $resultado['usuarios_info'],
                    'plantilla_cambiada' => $resultado['plantilla_cambiada']
                ]
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarExpedientes(): JsonResponse
    {
        try {
            $expedientes = $this->expedienteService->listarExpedientes();
            return ExpedienteResponse::expedientes($expedientes);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar expedientes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerExpedientePorId($id): JsonResponse
    {
        try {
            $expediente = $this->expedienteService->obtenerExpedientePorId($id);
            
            if (!$expediente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expediente no encontrado'
                ], 404);
            }

            return ExpedienteResponse::expediente($expediente);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerPorCodigoExpediente($codigo): JsonResponse
    {
        try {
            $expediente = $this->expedienteService->obtenerPorCodigoExpediente($codigo);
            
            if (!$expediente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expediente no encontrado'
                ], 404);
            }

            return ExpedienteResponse::expediente($expediente);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cambiarEstadoExpediente($id): JsonResponse
    {
        try {
            $expediente = $this->expedienteService->cambiarEstadoExpediente($id);
            
            if (!$expediente) {
                return response()->json([
                    'success' => false,
                    'message' => 'Expediente no encontrado'
                ], 404);
            }

            $estado = $expediente->activo ? 'activado' : 'desactivado';
            return response()->json([
                'success' => true,
                'message' => "Expediente {$estado} exitosamente",
                'data' => [
                    'expediente' => $expediente
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado del expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verificarUsuarioPorDocumento($numeroDocumento): JsonResponse
    {
        try {
            $resultado = $this->expedienteService->verificarUsuarioPorDocumento($numeroDocumento);
            
            return response()->json([
                'success' => true,
                'message' => $resultado['existe'] ? 'Usuario encontrado' : 'Usuario no encontrado',
                'data' => $resultado
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarExpedientesAsignados(): JsonResponse
    {
        try {
            $usuario = auth('api')->user();
            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no autenticado'
                ], 401);
            }
            $expedientes = $this->expedienteService->listarExpedientesPorUsuario($usuario->id_usuario, $usuario->id_rol);
            return ExpedienteResponse::expedientes($expedientes);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar expedientes asignados',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}