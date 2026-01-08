<?php

namespace App\Services;

use App\DTOs\UsuariosSolicitante\CrearUsuarioSolicitanteDTO;
use App\Mail\CodigoVerificacion;
use App\Models\UsuarioSolicitante;
use App\Repositories\SolicitudCodigoRepository;
use App\Repositories\UsuarioSolicitanteRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTAuth;

class UsuarioSolicitanteService
{
    public function __construct(
        private readonly UsuarioSolicitanteRepository $usuarioSolicitanteRepository,
        private readonly SolicitudCodigoRepository $solicitudCodigoRepository,
    ) {}

    public function crearUsuarioSolicitante(CrearUsuarioSolicitanteDTO $data): UsuarioSolicitante
    {
        return DB::transaction(function () use ($data) {
            $usuario = $this->obtenerOCrearUsuario($data);
            $this->generarYEnviarCodigo($usuario);
            return $usuario;
        });
    }

    public function verificarCodigoYAutenticar(string $codigo): array
    {
        $solicitudCodigo = $this->validarCodigo($codigo);
        $usuario = $this->usuarioSolicitanteRepository->buscarPorId($solicitudCodigo->id_usuario_solicitante);
        
        $this->solicitudCodigoRepository->marcarComoUsado($solicitudCodigo->id_solicitud_codigo);
        
        return [$usuario, $this->generarTokenJWT($usuario)];
    }

    public function reenviarCodigo(string $numeroDocumento): void
    {
        $usuario = $this->buscarUsuarioOFallar($numeroDocumento);
        $this->generarYEnviarCodigo($usuario);
    }

    private function obtenerOCrearUsuario(CrearUsuarioSolicitanteDTO $data): UsuarioSolicitante
    {
        $usuario = $this->usuarioSolicitanteRepository->buscarPorNumeroDocumento($data->numero_documento);
        
        return $usuario ?? $this->usuarioSolicitanteRepository->crear($data->toArray());
    }

    private function buscarUsuarioOFallar(string $numeroDocumento): UsuarioSolicitante
    {
        $usuario = $this->usuarioSolicitanteRepository->buscarPorNumeroDocumento($numeroDocumento);
        
        if (!$usuario) {
            throw new Exception('Usuario no encontrado', 404);
        }
        
        return $usuario;
    }

    private function validarCodigo(string $codigo)
    {
        $solicitudCodigo = $this->solicitudCodigoRepository->buscarCodigoValido($codigo);
        
        if (!$solicitudCodigo) {
            throw new Exception('Código inválido o expirado', 400);
        }
        
        return $solicitudCodigo;
    }

    private function generarYEnviarCodigo(UsuarioSolicitante $usuario): void
    {
        if (empty($usuario->correo)) {
            throw new Exception('El usuario no tiene correo electrónico registrado', 400);
        }

        $this->solicitudCodigoRepository->invalidarCodigosAnteriores($usuario->id_usuario_solicitante);

        $codigo = $this->generarCodigo();
        $fechaExpiracion = Carbon::now()->addMinutes(15);

        $this->solicitudCodigoRepository->crear([
            'codigo' => $codigo,
            'fecha_expiracion' => $fechaExpiracion,
            'usado' => false,
            'id_usuario_solicitante' => $usuario->id_usuario_solicitante
        ]);

        $this->enviarCodigoPorEmail($usuario, $codigo, $fechaExpiracion);
    }

    private function enviarCodigoPorEmail(UsuarioSolicitante $usuario, string $codigo, Carbon $fechaExpiracion): void
    {
        try {
            $mail = new CodigoVerificacion(
                nombreCompleto: $usuario->nombre_completo ?? 'Usuario',
                codigo: $codigo,
                fechaExpiracion: $fechaExpiracion->format('d/m/Y H:i')
            );

            Mail::to($usuario->correo)->send($mail);
            
        } catch (Exception $e) {
            Log::error('Error enviando código de verificación', [
                'usuario_id' => $usuario->id_usuario_solicitante,
                'error' => $e->getMessage()
            ]);
            throw new Exception('Error enviando código de verificación', 500);
        }
    }

    private function generarCodigo(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    private function generarTokenJWT(UsuarioSolicitante $usuario): string
    {
        $customClaims = [
            'id_usuario_solicitante' => $usuario->id_usuario_solicitante,
            'numero_documento' => $usuario->numero_documento,
            'tipo_usuario' => 'solicitante'
        ];

        return JWTAuth::claims($customClaims)->fromUser($usuario);
    }
}