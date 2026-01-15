<?php

namespace App\Http\Requests\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarPerfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => [
                'required',
                'string',
                'max:100',
                'min:3',
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/' // Solo letras, espacios y acentos
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_completo.required' => 'El nombre completo es obligatorio.',
            'nombre_completo.string' => 'El nombre completo debe ser texto válido.',
            'nombre_completo.max' => 'El nombre completo no puede tener más de 100 caracteres.',
            'nombre_completo.min' => 'El nombre completo debe tener al menos 3 caracteres.',
            'nombre_completo.regex' => 'El nombre completo solo puede contener letras, espacios y acentos.'
        ];
    }

    public function attributes(): array
    {
        return [
            'nombre_completo' => 'nombre completo'
        ];
    }
}