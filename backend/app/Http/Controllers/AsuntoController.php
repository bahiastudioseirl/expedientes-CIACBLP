<?php

namespace App\Http\Controllers;

use App\Http\Responses\AsuntoResponse;
use App\Services\AsuntoService;

use function Symfony\Component\Translation\t;

class AsuntoController extends Controller
{
    public function __construct(
        private readonly AsuntoService $asuntoService
    )
    {}    

    public function verAsuntosPorExpediente(string $idExpediente)
    {
        try{
            $idExpedienteInt = (int) $idExpediente;
            $asuntos = $this->asuntoService->verAsuntosPorExpediente($idExpedienteInt);
            
            if(!$asuntos){
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontraron asuntos para el expediente proporcionado'
                ], 404);
            }
            
            return AsuntoResponse::asuntos($asuntos);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los asuntos del expediente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cerrarOAbrirAsunto(int $idAsunto)
    {
        try {
            $resultado = $this->asuntoService->cerrarOAbrirAsunto($idAsunto);
            return AsuntoResponse::asuntoEstado($resultado);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null
            ], 400);
        }
    }
}