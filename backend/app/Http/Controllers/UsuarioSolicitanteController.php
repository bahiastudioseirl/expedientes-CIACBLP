<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsuariosSolicitantes\CrearUsuarioSolicitanteRequest;
use App\Http\Requests\UsuariosSolicitantes\VerificarCodigoRequest;
use App\Http\Requests\UsuariosSolicitantes\ReenviarCodigoRequest;
use App\Http\Responses\UsuariosSolicitantesResponse;
use App\Services\UsuarioSolicitanteService;
use App\DTOs\UsuariosSolicitante\CrearUsuarioSolicitanteDTO;
use Illuminate\Http\JsonResponse;
use Exception;

class UsuarioSolicitanteController extends Controller
{
    public function __construct(
        private readonly UsuarioSolicitanteService $usuarioSolicitanteService
    ) {}

    public function registrar(CrearUsuarioSolicitanteRequest $request): JsonResponse
    {
        try {
            $dto = CrearUsuarioSolicitanteDTO::fromRequest($request->validated());
            $usuario = $this->usuarioSolicitanteService->crearUsuarioSolicitante($dto);
            
            return UsuariosSolicitantesResponse::registroExitoso($usuario);
            
        } catch (Exception $e) {
            $status = $e->getCode() ?: 500;
            return UsuariosSolicitantesResponse::error($e->getMessage(), $status);
        }
    }

    public function verificarCodigo(VerificarCodigoRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            [$usuario, $token] = $this->usuarioSolicitanteService->verificarCodigoYAutenticar(
                $data['codigo']
            );
            
            return UsuariosSolicitantesResponse::autenticacion($usuario, $token);
            
        } catch (Exception $e) {
            $status = $e->getCode() ?: 500;
            return UsuariosSolicitantesResponse::error($e->getMessage(), $status);
        }
    }

    public function reenviarCodigo(ReenviarCodigoRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $this->usuarioSolicitanteService->reenviarCodigo($data['numero_documento']);
            
            return UsuariosSolicitantesResponse::codigoRenviado();
            
        } catch (Exception $e) {
            $status = $e->getCode() ?: 500;
            return UsuariosSolicitantesResponse::error($e->getMessage(), $status);
        }
    }
}
