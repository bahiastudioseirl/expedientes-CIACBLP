<?php

namespace App\Http\Controllers;

use App\DTOs\Plantillas\CrearPlantillaDTO;
use App\DTOs\Plantillas\ActualizarPlantillaDTO;
use App\Http\Requests\Plantillas\CrearPlantillaRequest;
use App\Http\Requests\Plantillas\ActualizarPlantillaRequest;
use App\Http\Responses\PlantillaResponse;
use App\Services\PlantillaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PlantillaController extends Controller
{
    public function __construct(
        private readonly PlantillaService $plantillaService
    )
    {}

    public function crearPlantilla(CrearPlantillaRequest $request): JsonResponse
    {
        try {
            $dto = CrearPlantillaDTO::fromRequest($request->validated());
            $plantilla = $this->plantillaService->crearPlantilla($dto);
            
            return PlantillaResponse::plantillaCreada($plantilla);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la plantilla',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function actualizarPlantilla($id, ActualizarPlantillaRequest $request): JsonResponse
    {
        try {
            $dto = ActualizarPlantillaDTO::fromRequest($request->validated());
            $plantilla = $this->plantillaService->actualizarPlantilla($id, $dto);
            
            if (!$plantilla) {
                return response()->json([
                    'success' => false,
                    'message' => 'Plantilla no encontrada'
                ], 404);
            }
            
            return PlantillaResponse::plantillaActualizada($plantilla);
            
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la plantilla',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarPlantillas(): JsonResponse
    {
        try {
            $plantillas = $this->plantillaService->listarPlantillas();
            return PlantillaResponse::plantillas($plantillas);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al listar plantillas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerPlantillaPorId($id): JsonResponse
    {
        try {
            $plantilla = $this->plantillaService->obtenerPlantillaPorId($id);
            
            if (!$plantilla) {
                return response()->json([
                    'success' => false,
                    'message' => 'Plantilla no encontrada'
                ], 404);
            }

            return PlantillaResponse::plantilla($plantilla);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener plantilla',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cambiarEstadoPlantilla($id): JsonResponse
    {
        try {
            $plantilla = $this->plantillaService->cambiarEstadoPlantilla($id);
            
            if (!$plantilla) {
                return response()->json([
                    'success' => false,
                    'message' => 'Plantilla no encontrada'
                ], 404);
            }

            return PlantillaResponse::plantillaEstadoCambiado($plantilla);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar estado de plantilla',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerEtapasPlantilla($id): JsonResponse
    {
        try {
            $etapas = $this->plantillaService->obtenerEtapasPlantilla($id);
            
            if ($etapas === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Plantilla no encontrada'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Etapas obtenidas exitosamente',
                'data' => $etapas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener etapas de la plantilla',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}