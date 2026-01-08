<?php

namespace App\Http\Requests\UsuariosSolicitantes;

use Illuminate\Foundation\Http\FormRequest;

class CrearUsuarioSolicitanteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => 'nullable|string|max:200',
            'numero_documento' => 'required|string|max:50',
            'correo' => 'nullable|string|email|max:150',
        ];
    }

    public function messages(): array
    {
        return [
            'numero_documento.required' => 'El número de documento es obligatorio.',
            'numero_documento.string' => 'El número de documento debe ser una cadena de texto.',
            'numero_documento.max' => 'El número de documento no puede exceder los 50 caracteres.',
            'nombre_completo.string' => 'El nombre completo debe ser una cadena de texto.',
            'nombre_completo.max' => 'El nombre completo no puede exceder los 200 caracteres.',
            'correo.string' => 'El correo debe ser una cadena de texto.',
            'correo.email' => 'El correo debe tener un formato válido.',
            'correo.max' => 'El correo no puede exceder los 150 caracteres.',
        ];
    }
}