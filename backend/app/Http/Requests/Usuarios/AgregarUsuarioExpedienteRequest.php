<?php

namespace App\Http\Requests\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class AgregarUsuarioExpedienteRequest extends FormRequest
{

    public function authorize():bool
    {
        return true;
    }

    public function rules() : array
    {
        return [
            'correo' => 'required|string|email|max:150|unique:usuarios,correo',
            'tipo' => 'required|string|in:demandante,demandado',
        ];
    }
    
    public function messages(): array
    {
        return [
            'correo.required' => 'El correo es requerido',
            'correo.string' => 'El correo debe ser una cadena de texto',
            'correo.email' => 'El correo debe ser una dirección de correo válida',
            'correo.max' => 'El correo no puede exceder 150 caracteres',
            'correo.unique' => 'El correo ya está registrado en el sistema',
            'tipo.required' => 'El tipo de parte es requerido',
            'tipo.in' => 'El tipo debe ser demandante o demandado',
        ];
    }

}