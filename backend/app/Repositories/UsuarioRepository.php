<?php

namespace App\Repositories;

use App\Models\Usuarios;
use Illuminate\Database\Eloquent\Collection;


class UsuarioRepository
{

    public function crear(array $data): Usuarios
    {
        return Usuarios::create($data);
    }

    public function actualizar(Usuarios $usuario, array $data): bool
    {
        return $usuario->update($data);
    }

    
    public function listarUsuarios(): Collection
    {
        return Usuarios::with('rol')->where('activo', true)->get();
    }

    public function listarAdministradores(): Collection
    {
        return Usuarios::with('rol')
                        ->whereHas('rol', function ($query) {
                            $query->where('nombre', 'Administrador');
                        })
                      ->where('activo', true)
                      ->get();
    }

    public function obtenerPorId(int $id): ?Usuarios
    {
        return Usuarios::with('rol')->find($id);
    }

    public function cambiarEstadoUsuario(Usuarios $usuario, bool $activo): bool
    {
        $usuario->activo = $activo;
        return $usuario->save();
    }
    
    public function contarUsuariosActivos(): int
    {
        return Usuarios::where('activo', true)->count();
    }
    
}