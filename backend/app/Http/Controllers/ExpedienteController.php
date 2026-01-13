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

    public function crearExpediente(CrearExpedienteRequest $request, int $idSolicitud): JsonResponse
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


}