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
            // Para personas (administradores, secretarios, árbitros)
            'nombre' => 'nullable|string|max:100',
            'apellido' => 'nullable|string|max:100',
            // Para empresas (demandantes, demandados)
            'nombre_empresa' => 'nullable|string|max:255',
            // Campos comunes
            'telefono' => 'required|string|max:20',
            'correos' => 'required|array|min:1',
            'correos.*' => 'required|email|max:150',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.string' => 'El nombre debe ser una cadena de texto.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
            'apellido.string' => 'El apellido debe ser una cadena de texto.',
            'apellido.max' => 'El apellido no puede tener más de 100 caracteres.',
            'nombre_empresa.string' => 'El nombre de la empresa debe ser una cadena de texto.',
            'nombre_empresa.max' => 'El nombre de la empresa no puede tener más de 255 caracteres.',
            'telefono.required' => 'El teléfono es obligatorio.',
            'telefono.string' => 'El teléfono debe ser una cadena de texto.',
            'telefono.max' => 'El teléfono no puede tener más de 20 caracteres.',
            'correos.required' => 'Al menos un correo electrónico es obligatorio.',
            'correos.array' => 'Los correos deben enviarse como un array.',
            'correos.min' => 'Debe proporcionar al menos un correo electrónico.',
            'correos.*.required' => 'Todos los correos son obligatorios.',
            'correos.*.email' => 'Los correos deben tener un formato válido.',
            'correos.*.max' => 'Los correos no pueden tener más de 150 caracteres.',
        ];
    }
}