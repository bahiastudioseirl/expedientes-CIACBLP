<?php

namespace App\Http\Controllers;

use App\DTOs\Flujos\CambiarFlujoDTO;
use App\DTOs\Flujos\ActualizarFlujoDTO;
use App\Http\Requests\Flujos\ActualizarFlujoRequest;
use App\Http\Requests\Flujos\CambiarFlujoRequest;
use App\Http\Responses\CaminoFlujoResponse;
use App\Http\Responses\FlujoResponse;
use App\Services\FlujoService;
use Illuminate\Support\Facades\Log;

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

    /**
     * Verifica si el expediente está en etapa 1, subetapa 5 para mostrar contadores
     */
    public function verificarMostrarContadores(int $idExpediente)
    {
        try {
            $flujoActual = $this->flujoService->obtenerFlujoActual($idExpediente);
            
            if (!$flujoActual) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'mostrar_contadores' => false,
                        'etapa_actual' => null,
                        'subetapa_actual' => null,
                        'etapa_orden' => null,
                        'subetapa_orden' => null
                    ],
                    'message' => 'No hay flujo activo'
                ]);
            }

            // Cargar las relaciones para acceder al campo 'orden'
            $flujoActual->load(['etapa', 'subetapa']);
            
            // Debug: Verificar qué datos tenemos
            Log::info('Flujo actual debug:', [
                'id_flujo' => $flujoActual->id_flujo,
                'id_etapa' => $flujoActual->id_etapa,
                'id_subetapa' => $flujoActual->id_subetapa,
                'etapa_existe' => $flujoActual->etapa ? true : false,
                'subetapa_existe' => $flujoActual->subetapa ? true : false,
                'etapa_orden' => $flujoActual->etapa ? $flujoActual->etapa->orden : 'NO_EXISTE',
                'subetapa_orden' => $flujoActual->subetapa ? $flujoActual->subetapa->orden : 'NO_EXISTE'
            ]);
            
            // Verificar si está en etapa orden 1, subetapa orden 5
            $etapaOrden = $flujoActual->etapa ? $flujoActual->etapa->orden : null;
            $subetapaOrden = $flujoActual->subetapa ? $flujoActual->subetapa->orden : null;
            
            $mostrarContadores = ($etapaOrden == 1 && $subetapaOrden == 5);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'mostrar_contadores' => $mostrarContadores,
                    'etapa_actual' => $flujoActual->id_etapa,
                    'subetapa_actual' => $flujoActual->id_subetapa,
                    'etapa_orden' => $etapaOrden,
                    'subetapa_orden' => $subetapaOrden
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en verificarMostrarContadores:', [
                'expediente_id' => $idExpediente,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar el estado del expediente',
                'error' => $e->getMessage(),
                'data' => [
                    'mostrar_contadores' => false,
                    'etapa_actual' => null,
                    'subetapa_actual' => null,
                    'etapa_orden' => null,
                    'subetapa_orden' => null
                ]
            ], 500);
        }
    }
}