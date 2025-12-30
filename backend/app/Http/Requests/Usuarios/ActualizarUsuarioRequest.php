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
        $usuarioId = $this->route('id');
        
        return [
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'sometimes|string|max:100',
            'numero_documento' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('usuarios', 'numero_documento')->ignore($usuarioId, 'id_usuario')
            ],
            'telefono' => 'nullable|string|max:20',
            'correo' => [
                'sometimes',
                'string',
                'email',
                'max:150',
                Rule::unique('usuarios', 'correo')->ignore($usuarioId, 'id_usuario')
            ],
            'contrasena' => 'sometimes|string|min:6',
            'activo' => 'sometimes|boolean',
            'id_rol' => 'sometimes|integer|exists:roles,id_rol',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.string' => 'El nombre debe ser texto.',
            'nombre.max' => 'El nombre no debe exceder 100 caracteres.',
            'apellido.string' => 'El apellido debe ser texto.',
            'apellido.max' => 'El apellido no debe exceder 100 caracteres.',
            'numero_documento.string' => 'El número de documento debe ser texto.',
            'numero_documento.max' => 'El número de documento no debe exceder 50 caracteres.',
            'numero_documento.unique' => 'El número de documento ya está en uso por otro usuario.',
            'telefono.string' => 'El teléfono debe ser texto.',
            'telefono.max' => 'El teléfono no debe exceder 20 caracteres.',
            'correo.string' => 'El correo debe ser texto.',
            'correo.email' => 'El correo debe ser una dirección de correo válida.',
            'correo.max' => 'El correo no debe exceder 150 caracteres.',
            'correo.unique' => 'El correo ya está en uso por otro usuario.',
            'contrasena.string' => 'La contraseña debe ser texto.',
            'contrasena.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'id_rol.integer' => 'El rol debe ser un número entero.',
            'id_rol.exists' => 'El rol seleccionado no es válido.',
        ];
    }
}