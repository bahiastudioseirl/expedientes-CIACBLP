<?php

namespace App\Services\Expediente;

use App\Models\Usuarios;
use App\Repositories\UsuarioRepository;
use App\Repositories\UsuarioExpedienteRepository;
use App\Repositories\RolRepository;
use App\Repositories\ExpedienteRepository;
use App\Mail\CredencialesExpediente;
use App\Mail\AsignacionExpediente;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CreadorUsuariosExpedienteService
{
    public function __construct(
        private readonly GeneradorCredencialesService $generadorCredenciales,
        private readonly UsuarioRepository $usuarioRepository,
        private readonly UsuarioExpedienteRepository $usuarioExpedienteRepository,
        private readonly RolRepository $rolRepository,
        private readonly ExpedienteRepository $expedienteRepository
    ) {}

    public function crearUsuariosPorCorreos(array $correos, int $idExpediente, string $rolNombre, string $mensaje = '', string $asuntoTitulo = '', array $adjuntos = [], bool $enviarCorreo = true): array
    {
        return DB::transaction(function () use ($correos, $idExpediente, $rolNombre, $mensaje, $asuntoTitulo, $adjuntos, $enviarCorreo) {
            $rol = $this->obtenerRolOFallar($rolNombre);
            $credenciales = [];
            
            // Obtener el expediente para envío de emails
            $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
            if (!$expediente) {
                throw new \Exception('Expediente no encontrado');
            }

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
                
                // Enviar credenciales por email solo si está habilitado
                if ($enviarCorreo) {
                    $email = new CredencialesExpediente(
                        correo: $correo,
                        contrasena: $contrasenaGenerada,
                        codigoExpediente: $expediente->codigo_expediente,
                        asuntoTitulo: $asuntoTitulo ?: 'Asunto',
                        mensaje: $mensaje,
                        adjuntos: $adjuntos // Pasar adjuntos a la plantilla de correo
                    );
                    
                    Mail::to($correo)->send($email);
                }

                $credenciales[$correo] = [
                    'id_usuario' => $usuario->id_usuario,
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

    public function vincularUsuarioExpediente(int $idUsuario, int $idExpediente): void
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

        // Obtener el expediente para envío de email
        $expediente = $this->expedienteRepository->obtenerPorId($idExpediente);
        if (!$expediente) {
            throw new \Exception('Expediente no encontrado');
        }
        
        Mail::to($correo)->send(new CredencialesExpediente(
            correo: $correo,
            contrasena: $contrasenaGenerada,
            codigoExpediente: $expediente->codigo_expediente,
            asuntoTitulo: 'Credenciales de acceso',
            mensaje: ''
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
