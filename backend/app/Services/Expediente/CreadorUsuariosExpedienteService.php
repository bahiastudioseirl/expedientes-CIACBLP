<?php

namespace App\Services\Expediente;

use App\Models\Usuarios;
use App\Repositories\UsuarioRepository;
use App\Repositories\UsuarioExpedienteRepository;
use App\Repositories\RolRepository;
use App\Mail\CredencialesExpediente;
use App\Mail\AsignacionExpediente;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CreadorUsuariosExpedienteService
{
    public function __construct(
        private readonly GeneradorCredencialesService $generadorCredenciales,
        private readonly UsuarioRepository $usuarioRepository,
        private readonly UsuarioExpedienteRepository $usuarioExpedienteRepository,
        private readonly RolRepository $rolRepository
    ) {}

    public function crearUsuariosPorCorreos(array $correos, int $idExpediente, string $rolNombre): array
    {
        return DB::transaction(function () use ($correos, $idExpediente, $rolNombre) {
            $rol = $this->obtenerRolOFallar($rolNombre);
            $credenciales = [];

            foreach ($correos as $correo) {
                $contrasenaGenerada = $this->generadorCredenciales->generarContrasena();
                
                $usuario = $this->usuarioRepository->crear([
                    'correo' => $correo,
                    'contrasena' => $contrasenaGenerada,
                    'nombre_completo' => '',
                    'numero_documento' => null,
                    'telefono' => null,
                    'activo' => true,
                    'id_rol' => $rol->id_rol,
                ]);

                $this->vincularUsuarioExpediente($usuario->id_usuario, $idExpediente);

                $credenciales[$correo] = [
                    'correo' => $correo,
                    'contrasena' => $contrasenaGenerada,
                ];
            }

            return $credenciales;
        });
    }

    public function crearUsuarioSecretario(
        string $nombreCompleto,
        string $correo,
        ?string $telefono,
        int $idExpediente
    ): array {
        return DB::transaction(function () use ($nombreCompleto, $correo, $telefono, $idExpediente) {
            $rol = $this->obtenerRolOFallar('Secretario');
            $contrasenaGenerada = $this->generadorCredenciales->generarContrasena();
            
            $usuario = $this->usuarioRepository->crear([
                'correo' => $correo,
                'contrasena' => $contrasenaGenerada,
                'nombre_completo' => $nombreCompleto,
                'numero_documento' => null,
                'telefono' => $telefono,
                'activo' => true,
                'id_rol' => $rol->id_rol,
            ]);

            $this->vincularUsuarioExpediente($usuario->id_usuario, $idExpediente);

            return [
                'nombre_completo' => $nombreCompleto,
                'correo' => $correo,
                'contrasena' => $contrasenaGenerada,
                'telefono' => $telefono,
            ];
        });
    }

    public function crearUsuarioArbitro(
        string $nombreCompleto,
        string $numeroDocumento,
        string $correo,
        ?string $telefono,
        int $idExpediente
    ): array {
        return DB::transaction(function () use ($nombreCompleto, $numeroDocumento, $correo, $telefono, $idExpediente) {
            $this->obtenerRolOFallar('Arbitro');
            
            $usuarioExistente = $this->usuarioRepository->buscarPorDocumentoOCorreo($numeroDocumento, $correo);

            if ($usuarioExistente) {
                return $this->procesarArbitroExistente($usuarioExistente, $idExpediente);
            }

            return $this->crearNuevoArbitro($nombreCompleto, $numeroDocumento, $correo, $telefono, $idExpediente);
        });
    }

    private function obtenerRolOFallar(string $nombreRol)
    {
        $rol = $this->rolRepository->obtenerPorNombre($nombreRol);
        
        if (!$rol) {
            throw new \Exception("Rol '{$nombreRol}' no encontrado");
        }

        return $rol;
    }

    private function vincularUsuarioExpediente(int $idUsuario, int $idExpediente): void
    {
        $this->usuarioExpedienteRepository->crear([
            'id_usuario' => $idUsuario,
            'id_expediente' => $idExpediente,
        ]);
    }

    private function generarCodigoExpediente(int $idExpediente): string
    {
        return 'EXP-' . str_pad($idExpediente, 6, '0', STR_PAD_LEFT);
    }

    private function procesarArbitroExistente(Usuarios $usuario, int $idExpediente): array
    {
        if (!$this->usuarioExpedienteRepository->existeVinculo($usuario->id_usuario, $idExpediente)) {
            $this->vincularUsuarioExpediente($usuario->id_usuario, $idExpediente);
        }

        Mail::to($usuario->correo)->send(new AsignacionExpediente(
            nombre_completo: $usuario->nombre_completo,
            codigo_expediente: $this->generarCodigoExpediente($idExpediente),
            rol: 'Árbitro'
        ));

        return [
            'usuario_existente' => true,
            'mensaje' => 'Árbitro vinculado exitosamente al expediente. Notificación enviada por correo',
            'nombre_completo' => $usuario->nombre_completo,
            'correo' => $usuario->correo,
            'telefono' => $usuario->telefono,
            'numero_documento' => $usuario->numero_documento,
        ];
    }

    private function crearNuevoArbitro(
        string $nombreCompleto,
        string $numeroDocumento,
        string $correo,
        ?string $telefono,
        int $idExpediente
    ): array {
        $rol = $this->obtenerRolOFallar('Arbitro');
        $contrasenaGenerada = $this->generadorCredenciales->generarContrasena();
        
        $usuario = $this->usuarioRepository->crear([
            'correo' => $correo,
            'contrasena' => $contrasenaGenerada,
            'nombre_completo' => $nombreCompleto,
            'numero_documento' => $numeroDocumento,
            'telefono' => $telefono,
            'activo' => true,
            'id_rol' => $rol->id_rol,
        ]);

        $this->vincularUsuarioExpediente($usuario->id_usuario, $idExpediente);

        Mail::to($correo)->send(new CredencialesExpediente(
            nombre_completo: $nombreCompleto,
            correo: $correo,
            contrasena: $contrasenaGenerada,
            codigo_expediente: $this->generarCodigoExpediente($idExpediente),
            numeroDocumento: $numeroDocumento
        ));

        return [
            'usuario_existente' => false,
            'mensaje' => 'Árbitro creado y vinculado exitosamente. Credenciales enviadas por correo',
            'nombre_completo' => $nombreCompleto,
            'correo' => $correo,
            'telefono' => $telefono,
            'numero_documento' => $numeroDocumento,
        ];
    }
}
