<?php

namespace App\Repositories\SecondDB;

use App\Models\SecondDB\Postulantes;

class PostulantesArbitroRepository
{
    public function buscarPorNombre(string $nombre, int $limite): array
    {
        $postulantes = Postulantes::activos()
            ->where(function($query) use ($nombre) {
                $query->where('nombres', 'LIKE', "%{$nombre}%")
                      ->orWhere('apellidos', 'LIKE', "%{$nombre}%");
            })
            ->limit($limite)
            ->get();

        return $postulantes->map(function($postulante) {
            return [
                'id' => $postulante->id,
                'nombre_completo' => trim($postulante->nombres_formateados . ' ' . $postulante->apellidos_formateados),
                'numero_documento' => $postulante->dni_pasaporte,
                'telefono' => $postulante->telefono,
                'correo' => $postulante->correo,
            ];
        })->toArray();
    }
}