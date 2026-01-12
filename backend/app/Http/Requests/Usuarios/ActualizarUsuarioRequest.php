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
            'numero_documento' => 'nullable|string|max:50|' . Rule::unique('usuarios', 'numero_documento')->ignore($this->route('usuario')->id_usuario),
            'correo' => 'nullable|string|email|max:150|' . Rule::unique('usuarios', 'correo')->ignore($this->route('usuario')->id_usuario),
            'contrasena' => 'sometimes|string|min:6',
            'telefono' => 'nullable|string|max:20',
            'activo' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_completo.string' => 'El nombre completo debe ser una cadena de texto',
            'numero_documento.string' => 'El número de documento debe ser una cadena de texto',
            'numero_documento.max' => 'El número de documento no puede exceder 50 caracteres',
            'numero_documento.unique' => 'El número de documento ya está en uso',
            'correo.string' => 'El correo debe ser una cadena de texto',
            'correo.email' => 'El correo debe ser una dirección de correo válida',
            'correo.max' => 'El correo no puede exceder 150 caracteres',
            'correo.unique' => 'El correo ya está en uso',
            'contrasena.string' => 'La contraseña debe ser una cadena de texto',
            'contrasena.min' => 'La contraseña debe tener al menos 6 caracteres',
            'telefono.string' => 'El teléfono debe ser una cadena de texto',
            'telefono.max' => 'El teléfono no puede exceder 20 caracteres',
            'activo.boolean' => 'El campo activo debe ser verdadero o falso',
        ];
    }
}