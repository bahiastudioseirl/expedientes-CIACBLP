<?php

namespace App\Http\Controllers;

use App\DTOs\Flujos\CambiarFlujoDTO;
use App\DTOs\Flujos\ActualizarFlujoDTO;
use App\Http\Requests\Flujos\ActualizarFlujoRequest;
use App\Http\Requests\Flujos\CambiarFlujoRequest;
use App\Http\Responses\CaminoFlujoResponse;
use App\Http\Responses\FlujoResponse;
use App\Services\FlujoService;

class FlujoController extends Controller
{

    public function __construct(
        private readonly FlujoService $flujoService
        
    )
    {}

    public function obtenerFlujosPorExpediente(int $idExpediente)
    {
        try {
            $flujos = $this->flujoService->obtenerFlujosPorExpediente($idExpediente);

            if (empty($flujos)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron flujos para el expediente proporcionado'
                ], 404);
            }

            return FlujoResponse::flujos($flujos);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los flujos del expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerFlujoActual(int $idExpediente)
    {
        try {
            $flujoActual = $this->flujoService->obtenerFlujoActual($idExpediente);

            if (!$flujoActual) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró un flujo actual para el expediente proporcionado'
                ], 404);
            }

            return FlujoResponse::flujo($flujoActual);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el flujo actual del expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarFlujosPorExpediente(int $idExpediente)
    {
        try {
            $flujos = $this->flujoService->listarFlujosPorExpediente($idExpediente);
            
            return FlujoResponse::flujos($flujos);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los flujos del expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }






    public function cambiarEtapaSubetapa(int $idExpediente, CambiarFlujoRequest $request)
    {
        try {
            $data = CambiarFlujoDTO::fromRequest($request->all(), $idExpediente);
            $nuevoFlujo = $this->flujoService->cambiarEtapaSubetapa($idExpediente, $data);
            return FlujoResponse::etapaOsubEtapaCambiada($nuevoFlujo);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cambiar la etapa y subetapa',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function actualizarFlujo(int $idExpediente, ActualizarFlujoRequest $request)
    {
        try {
            $data = ActualizarFlujoDTO::fromRequest($request->all());
            $flujoActualizado = $this->flujoService->actualizarFlujo($idExpediente, $data);
            return FlujoResponse::etapaOsubEtapaCambiada($flujoActualizado);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el flujo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerEtapasPlantillaExpediente(int $idExpediente)
    {
        try {
            $etapas = $this->flujoService->obtenerEtapasPlantillaExpediente($idExpediente);
            return response()->json([
                'success' => true,
                'data' => $etapas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las etapas de la plantilla del expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerCaminoExpediente(int $idExpediente)
    {
        try {
            $camino = $this->flujoService->obtenerCaminoExpediente($idExpediente);
            
            return CaminoFlujoResponse::caminoExpediente($camino);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el camino del expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}