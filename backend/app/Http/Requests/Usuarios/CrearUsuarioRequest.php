<?php

namespace App\Http\Requests\Usuarios;

use Illuminate\Foundation\Http\FormRequest;

class CrearUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => 'required|string|max:100',
            'numero_documento' => 'nullable|string|max:50',
            'correo' => 'required|string|email|max:150|unique:usuarios,correo',
            'telefono' => 'nullable|string|max:20',
        ];
    }
    public function messages(): array
    {
        return [
            'nombre_completo.required' => 'El nombre completo es obligatorio.',
            'nombre_completo.string' => 'El nombre completo debe ser texto.',
            'nombre_completo.max' => 'El nombre completo no puede exceder 100 caracteres.',

            'numero_documento.string' => 'El número de documento debe ser texto.',
            'numero_documento.max' => 'El número de documento no puede exceder 50 caracteres.',

            'correo.required' => 'El correo electrónico es obligatorio.',
            'correo.string' => 'El correo electrónico debe ser texto.',
            'correo.email' => 'El correo electrónico debe tener un formato válido.',
            'correo.max' => 'El correo electrónico no puede exceder 150 caracteres.',
            'correo.unique' => 'El correo electrónico ya está en uso.',

            'telefono.string' => 'El teléfono debe ser texto.',
            'telefono.max' => 'El teléfono no puede exceder 20 caracteres.', 
        ];
    }

}