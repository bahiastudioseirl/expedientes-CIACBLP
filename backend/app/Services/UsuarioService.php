<?php

namespace App\Services;

use App\DTOs\Usuarios\ActualizarUsuarioDTO;
use App\DTOs\Usuarios\CrearUsuarioDTO;
use App\Models\Usuarios;
use App\Models\Correos;
use App\Repositories\UsuarioRepository;
use App\Repositories\CorreoRepository;
use App\Exceptions\UltimoUsuarioException;
use App\Repositories\SecondDB\PostulantesArbitroRepository;
use Illuminate\Database\Eloquent\Collection;

class UsuarioService
{
    public function __construct(
        private readonly UsuarioRepository $usuarioRepository,
        private readonly PostulantesArbitroRepository $postulantesArbitroRepository
    ){}

    public function crearUsuario(CrearUsuarioDTO $data)
    {

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

    public function buscarArbitrosPorNombre(string $nombre, int $limite = 10): array
    {
        // Primero buscar en la BD principal (usuarios árbitros existentes)
        $resultadosPrincipales = $this->usuarioRepository->buscarArbitrosPorNombre($nombre, $limite);
        
        // Si encuentra resultados en la BD principal, retornarlos
        if (!empty($resultadosPrincipales)) {
            return $resultadosPrincipales;
        }
        
        // Si no encuentra en BD principal, buscar en BD secundaria (Postulantes)
        $resultadosSecundarios = $this->postulantesArbitroRepository->buscarPorNombre($nombre, $limite);
        
        // Marcar el origen como BD secundaria
        return array_map(function ($arbitro) {
            $arbitro['origen'] = 'bd_secundaria';
            return $arbitro;
        }, $resultadosSecundarios);
    }


}