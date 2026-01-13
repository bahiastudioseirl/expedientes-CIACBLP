<?php

namespace App\Http\Controllers;

use App\DTOs\Expedientes\CrearExpedienteDTO;
use App\Http\Requests\Expedientes\CrearExpedienteRequest;
use App\Http\Responses\ExpedienteResponse;
use App\Services\ExpedienteService;
use Illuminate\Http\JsonResponse;

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


}