<?php

namespace App\Repositories;

use App\Models\UsuarioSolicitante;

class UsuarioSolicitanteRepository
{
    public function crear(array $data): UsuarioSolicitante
    {
        return UsuarioSolicitante::create($data);
    }
    
    public function buscarPorNumeroDocumento(string $numeroDocumento): ?UsuarioSolicitante
    {
        return UsuarioSolicitante::where('numero_documento', $numeroDocumento)->first();
    }
    
    public function buscarPorCorreo(string $correo): ?UsuarioSolicitante
    {
        return UsuarioSolicitante::where('correo', $correo)->first();
    }
    
    public function buscarPorId(int $id): ?UsuarioSolicitante
    {
        return UsuarioSolicitante::find($id);
    }
}