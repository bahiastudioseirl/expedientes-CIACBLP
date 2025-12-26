<?php

namespace App\Repositories\SecondDB;

use App\Models\SecondDB\Postulantes;

class PostulantesArbitroRepository
{
    public function obtenerPorNumeroDocumento(string $numeroDocumento): ?array
    {
        $postulante = Postulantes::buscarPorDocumento($numeroDocumento);
        
        if (!$postulante) {
            return null;
        }

        return [
            'id' => $postulante->id,
            'nombre' => $postulante->nombres_formateados,
            'apellido' => $postulante->apellidos_formateados,
            'numero_documento' => $postulante->dni_pasaporte,
            'telefono' => $postulante->telefono,
            'correos' => $postulante->correo ? [$postulante->correo] : [], 
            'tipo' => 'arbitro' 
        ];
    }
    
    public function existeArbitroPorDocumento(string $numeroDocumento): bool
    {
        return Postulantes::buscarPorDocumento($numeroDocumento) !== null;
    }
}