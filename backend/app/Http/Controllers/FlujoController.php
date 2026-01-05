<?php

namespace App\Http\Controllers;

use App\Http\Requests\Flujos\ActualizarFlujoRequest;
use App\Http\Requests\Flujos\CrearFlujoRequest;
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

    public function cambiarEtapaSubetapa(CrearFlujoRequest $request)
    {
        try {
            $resultado = $this->flujoService->cambiarEtapaSubetapa(
                $request->input('id_expediente'),
                $request->input('id_etapa'),
                $request->input('id_subetapa'),
                $request->input('asunto')
            );
            
            return FlujoResponse::cambioEtapaSubetapa($resultado);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
        }
    }

    public function actualizarFlujoYAsunto(int $idFlujo, ActualizarFlujoRequest $request)
    {
        try {
            $resultado = $this->flujoService->actualizarFlujoYAsunto(
                $idFlujo,
                $request->input('id_etapa'),
                $request->input('id_subetapa'),
                $request->input('asunto', '')
            );
            
            return FlujoResponse::cambioEtapaSubetapa($resultado);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
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


}