<?php

namespace App\Http\Requests\UsuariosSolicitantes;

use Illuminate\Foundation\Http\FormRequest;

class VerificarCodigoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo' => 'required|string|size:6',
        ];
    }

    public function messages(): array
    {
        return [
            'codigo.required' => 'El código de verificación es obligatorio.',
            'codigo.string' => 'El código debe ser una cadena de texto.',
            'codigo.size' => 'El código debe tener exactamente 6 caracteres.',
        ];
    }
}