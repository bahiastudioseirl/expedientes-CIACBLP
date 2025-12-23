<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero_documento' => 'required|string|max:50',
            'contrasena' => 'required|string|min:6|max:255'
        ];
    }
    
    public function messages(): array
    {
        return [
            'numero_documento.required' => 'El número de documento es requerido',
            'numero_documento.max' => 'El número de documento no puede exceder 50 caracteres',
            'contrasena.required' => 'La contraseña es requerida',
            'contrasena.min' => 'La contraseña debe tener al menos 6 caracteres',
            'contrasena.max' => 'La contraseña no puede exceder 255 caracteres'
        ];
    }
}
