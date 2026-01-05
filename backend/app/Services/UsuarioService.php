<?php

namespace App\Services;

use App\DTOs\Usuarios\ActualizarUsuarioDTO;
use App\DTOs\Usuarios\CrearUsuarioDTO;
use App\Models\Usuarios;
use App\Models\Correos;
use App\Repositories\UsuarioRepository;
use App\Repositories\CorreoRepository;
use App\Exceptions\UltimoUsuarioException;
use Illuminate\Database\Eloquent\Collection;

class UsuarioService
{
    public function __construct(
        private readonly UsuarioRepository $usuarioRepository,
        private readonly CorreoRepository $correoRepository
    ){}

    public function crearUsuario(CrearUsuarioDTO $data): Usuarios
    {
        $usuario = $this->usuarioRepository->crear($data->toArray());
        
        // Crear correos si se proporcionan
        if (!empty($data->correos)) {
            foreach ($data->correos as $correo) {
                Correos::create([
                    'id_usuario' => $usuario->id_usuario,
                    'correo_electronico' => $correo
                ]);
            }
        }
        
        return $usuario->load(['rol', 'correos']);
    }

    // Método unificado para crear usuarios personas (admin, secretario, arbitro)
    public function crearUsuarioPersona(CrearUsuarioDTO $data, int $idRol): Usuarios
    {
        $datosArray = $data->toArray();
        $datosArray['id_rol'] = $idRol;
        
        $usuario = $this->usuarioRepository->crear($datosArray);
        
        // Crear correos si se proporcionan
        if (!empty($data->correos)) {
            foreach ($data->correos as $correo) {
                Correos::create([
                    'id_usuario' => $usuario->id_usuario,
                    'correo_electronico' => $correo
                ]);
            }
        }
        
        return $usuario->load(['rol', 'correos']);
    }

    // Método unificado para crear usuarios empresa (demandante, demandado)
    public function crearUsuarioEmpresa(CrearUsuarioDTO $data, int $idRol): Usuarios
    {
        $datosArray = $data->toArray();
        $datosArray['id_rol'] = $idRol;
        
        $usuario = $this->usuarioRepository->crear($datosArray);
        
        // Crear correos si se proporcionan
        if (!empty($data->correos)) {
            foreach ($data->correos as $correo) {
                Correos::create([
                    'id_usuario' => $usuario->id_usuario,
                    'correo_electronico' => $correo
                ]);
            }
        }
        
        return $usuario->load(['rol', 'correos']);
    }

    // Métodos específicos que usan los métodos unificados
    public function crearUsuarioAdministrador(CrearUsuarioDTO $data): Usuarios
    {
        return $this->crearUsuarioPersona($data, 1); // ID del rol administrador
    }

    public function crearUsuarioSecretario(CrearUsuarioDTO $data): Usuarios
    {
        return $this->crearUsuarioPersona($data, 3); // ID del rol secretario
    }
    
    public function crearUsuarioArbitro(CrearUsuarioDTO $data): Usuarios
    {
        return $this->crearUsuarioPersona($data, 2); // ID del rol arbitro
    }
    
    public function crearUsuarioDemandante(CrearUsuarioDTO $data): Usuarios
    {
        return $this->crearUsuarioEmpresa($data, 4); // ID del rol demandante
    }

    public function crearUsuarioDemandado(CrearUsuarioDTO $data): Usuarios
    {
        return $this->crearUsuarioEmpresa($data, 5); // ID del rol demandado
    }

    public function listarUsuarios(): Collection
    {
        return $this->usuarioRepository->listarUsuarios();
    }

    public function listarAdministradores(): Collection
    {
        return $this->usuarioRepository->listarAdministradores();
    }

    public function obtenerUsuarioPorId(int $id): ?Usuarios
    {
        return $this->usuarioRepository->obtenerPorId($id);
    }

    public function actualizarUsuario(int $id, ActualizarUsuarioDTO $data): ?Usuarios
    {
        $usuario = $this->usuarioRepository->obtenerPorId($id);
        if (!$usuario) {
            return null;
        }
        
        // Actualizar datos básicos del usuario
        $this->usuarioRepository->actualizar($usuario, $data->toArray());
        
        // Actualizar correos si se proporcionaron
        if ($data->correos !== null) {
            $this->correoRepository->actualizarCorreosPorUsuario($id, $data->correos);
        }
        
        return $usuario->fresh()->load(['rol', 'correos']);
    }

    public function cambiarEstadoUsuario(int $id): bool
    {
        $usuario = $this->usuarioRepository->obtenerPorId($id);
        if (!$usuario) {
            return false;
        }
        
        if ($usuario->activo) {
            $usuariosActivos = $this->usuarioRepository->contarUsuariosActivos();
            if ($usuariosActivos <= 1) {
                throw new UltimoUsuarioException();
            }
            return $this->usuarioRepository->cambiarEstadoUsuario($usuario, false);
        } else {
            return $this->usuarioRepository->cambiarEstadoUsuario($usuario, true);
        }
    }


    public function listarUsuariosArbitros(): Collection
    {
        return $this->usuarioRepository->listarUsuariosArbitros();
    }

    public function listarUsuariosSecretarios(): Collection
    {
        return $this->usuarioRepository->listarUsuariosSecretarios();
    }

    public function listarUsuariosDemandantes(): Collection
    {
        return $this->usuarioRepository->listarUsuariosDemandantes();
    }

    public function listarUsuariosDemandados(): Collection
    {
        return $this->usuarioRepository->listarUsuariosDemandados();
    }

}