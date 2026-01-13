<?php

namespace App\Services\Expediente;

use Illuminate\Support\Str;

class GeneradorCredencialesService
{
    public function generarContrasena(int $longitud = 12): string
    {
        return Str::random($longitud);
    }
    public function generarCredenciales(string $correo): array
    {
        return [
            'correo' => $correo,
            'contrasena' => $this->generarContrasena(),
        ];
    }
}