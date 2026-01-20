<?php

namespace App\Http\Controllers;

use App\DTOs\Expedientes\CrearArbitroEnExpedienteDTO;
use App\Http\Requests\Expedientes\CrearArbitroEnExpedienteRequest;
use App\Http\Responses\ExpedienteResponse;
use App\Services\Expediente\CreadorUsuariosExpedienteService;
use App\Services\UsuarioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ArbitroController extends Controller
{
    public function __construct(
        private readonly UsuarioService $usuarioService,
        private readonly CreadorUsuariosExpedienteService $creadorUsuarios
    ) {}

    public function buscar(Request $request): JsonResponse
    {
        try {
            $nombre = $request->query('nombre', '');
            $arbitros = $this->usuarioService->buscarArbitrosPorNombre($nombre);

            return response()->json([
                'success' => true,
                'data' => $arbitros
            ]);
        } catch (\Exception $e) {
            Log::error('Error al buscar árbitros: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar árbitros'
            ], 500);
        }
    }

    public function buscarBDPrimaria(Request $request): JsonResponse
    {
        try {
            $nombre = $request->query('nombre', '');
            $arbitros = $this->usuarioService->buscarArbitrosEnBDPrimariaPorNombre($nombre);

            return response()->json([
                'success' => true,
                'data' => $arbitros
            ]);
        } catch (\Exception $e) {
            Log::error('Error al buscar árbitros en BD primaria: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al buscar árbitros en BD primaria'
            ], 500);
        }
    }

    public function crearEnExpediente(CrearArbitroEnExpedienteRequest $request, int $idExpediente): JsonResponse
    {
        try {
            $validated = $request->validated();
            $validated['id_expediente'] = $idExpediente;
            $dto = CrearArbitroEnExpedienteDTO::fromRequest($validated);
            
            $resultado = $this->creadorUsuarios->crearUsuarioArbitro(
                nombreCompleto: $dto->nombre_arbitro,
                numeroDocumento: $dto->numero_documento,
                correo: $dto->correo_arbitro,
                telefono: $dto->telefono_arbitro,
                idExpediente: $dto->id_expediente
            );

            return ExpedienteResponse::arbitroVinculado($resultado);
        } catch (\Exception $e) {
            Log::error('Error al crear árbitro en expediente: ' . $e->getMessage());
            return ExpedienteResponse::error('Error al crear árbitro en expediente', 500);
        }
    }
}
