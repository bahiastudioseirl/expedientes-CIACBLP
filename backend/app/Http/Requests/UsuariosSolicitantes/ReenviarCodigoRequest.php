<?php

namespace App\Http\Requests\UsuariosSolicitantes;

use Illuminate\Foundation\Http\FormRequest;

class ReenviarCodigoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero_documento' => 'required|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'numero_documento.required' => 'El número de documento es obligatorio.',
            'numero_documento.string' => 'El número de documento debe ser una cadena de texto.',
            'numero_documento.max' => 'El número de documento no puede exceder los 50 caracteres.',
        ];
    }
}