<?php

namespace App\Services\Expediente;

use App\Repositories\UsuarioRepository;
use App\Repositories\UsuarioExpedienteRepository;
use App\Repositories\RolRepository;
use Illuminate\Support\Facades\DB;

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
            $rol = $this->rolRepository->obtenerPorNombre($rolNombre);
            
            if (!$rol) {
                throw new \Exception("Rol '{$rolNombre}' no encontrado");
            }

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

                $this->usuarioExpedienteRepository->crear([
                    'id_usuario' => $usuario->id_usuario,
                    'id_expediente' => $idExpediente,
                ]);

                $credenciales[$correo] = [
                    'correo' => $correo,
                    'contrasena' => $contrasenaGenerada,
                ];
            }

            return $credenciales;
        });
    }

    /**
     * Crear usuario para el secretario arbitral
     */
    public function crearUsuarioSecretario(
        string $nombreCompleto,
        string $correo,
        ?string $telefono,
        int $idExpediente
    ): array {
        return DB::transaction(function () use ($nombreCompleto, $correo, $telefono, $idExpediente) {
            $rol = $this->rolRepository->obtenerPorNombre('Secretario');
            
            if (!$rol) {
                throw new \Exception("Rol 'Secretario' no encontrado");
            }

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

            $this->usuarioExpedienteRepository->crear([
                'id_usuario' => $usuario->id_usuario,
                'id_expediente' => $idExpediente,
            ]);

            return [
                'nombre_completo' => $nombreCompleto,
                'correo' => $correo,
                'contrasena' => $contrasenaGenerada,
                'telefono' => $telefono,
            ];
        });
    }
}