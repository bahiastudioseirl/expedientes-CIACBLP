<?php

namespace App\Services;

use App\DTOs\Usuarios\ActualizarUsuarioDTO;
use App\DTOs\Usuarios\CrearUsuarioDTO;
use App\Models\Usuarios;
use App\Repositories\UsuarioRepository;
use App\Exceptions\UltimoUsuarioException;
use Illuminate\Database\Eloquent\Collection;

class UsuarioService
{
    public function __construct(
        private readonly UsuarioRepository $usuarioRepository
    ){}

    public function crearUsuario(CrearUsuarioDTO $data): Usuarios
    {
        $usuario = $this->usuarioRepository->crear($data->toArray());
        return $usuario->load('rol');
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
        
        $this->usuarioRepository->actualizar($usuario, $data->toArray());
        return $usuario->fresh()->load('rol');
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