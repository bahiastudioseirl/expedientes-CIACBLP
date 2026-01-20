<?php

namespace App\Http\Requests\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class AgregarUsuarioStaffExpedienteRequest extends FormRequest
{
    public function authorize():bool
    {
        return true;
    }

    public function rules() : array
    {
        return [
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
        ];
    }
    
    public function messages(): array
    {
        return [
            'id_usuario.required' => 'El ID del usuario es requerido',
            'id_usuario.integer' => 'El ID del usuario debe ser un número entero',
            'id_usuario.exists' => 'El usuario no existe en el sistema',
        ];
    }
}