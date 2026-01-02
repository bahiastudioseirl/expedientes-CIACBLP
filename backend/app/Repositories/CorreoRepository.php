<?php

namespace App\Repositories;

use App\Models\Correos;
use Illuminate\Database\Eloquent\Collection;

class CorreoRepository
{
    public function crear(array $data): Correos
    {
        return Correos::create($data);
    }

    public function crearMultiples(int $idUsuario, array $correos): Collection
    {
        $correosCreados = [];
        
        foreach ($correos as $direccion) {
            $correo = $this->crear([
                'direccion' => $direccion,
                'id_usuario' => $idUsuario
            ]);
            $correosCreados[] = $correo;
        }
        
        return new Collection($correosCreados);
    }

    public function obtenerCorreosPorUsuario(int $idUsuario): Collection
    {
        return Correos::where('id_usuario', $idUsuario)->get();
    }

    public function eliminarPorCorreos(int $idUsuario, array $correosAEliminar): bool
    {
        return Correos::where('id_usuario', $idUsuario)
                     ->whereIn('direccion', $correosAEliminar)
                     ->delete();
    }
}