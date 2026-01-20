<?php

namespace App\Http\Requests\Usuarios;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActualizarUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => 'nullable|string',
            'numero_documento' => 'nullable|string|max:50',
            'correo' => 'nullable|string|email|max:150',
            'telefono' => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_completo.string' => 'El nombre completo debe ser texto.',
            'numero_documento.string' => 'El número de documento debe ser texto.',
            'numero_documento.max' => 'El número de documento no puede exceder 50 caracteres.',
            'numero_documento.unique' => 'El número de documento ya está en uso.',
            'correo.string' => 'El correo debe ser texto.',
            'correo.email' => 'El correo debe tener un formato válido.',
            'correo.max' => 'El correo no puede exceder 150 caracteres.',
            'correo.unique' => 'El correo ya está en uso.',
            'telefono.string' => 'El teléfono debe ser texto.',
            'telefono.max' => 'El teléfono no puede exceder 20 caracteres.',
        ];
    }
}