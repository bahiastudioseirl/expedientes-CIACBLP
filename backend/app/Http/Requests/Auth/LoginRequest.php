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
            'correo' => 'required|string',
            'contrasena' => 'required|string|min:6|max:255'
        ];
    }
    
    public function messages(): array
    {
        return [
            'correo.required' => 'El correo es requerido',
            'correo.string' => 'El correo debe ser una cadena de texto',
            'contrasena.required' => 'La contraseña es requerida',
            'contrasena.min' => 'La contraseña debe tener al menos 6 caracteres',
            'contrasena.max' => 'La contraseña no puede exceder 255 caracteres'
        ];
    }
}
