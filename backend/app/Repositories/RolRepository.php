<?php

namespace App\Repositories;

use App\Models\Roles;
use Illuminate\Database\Eloquent\Collection;

class RolRepository
{
    public function obtenerPorNombre(string $nombre): ?Roles
    {
        return Roles::where('nombre', $nombre)->first();
    }

    public function obtenerPorId(int $id): ?Roles
    {
        return Roles::find($id);
    }

    public function listarTodos(): Collection
    {
        return Roles::all();
    }
}
