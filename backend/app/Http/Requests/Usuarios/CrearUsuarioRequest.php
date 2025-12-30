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
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'numero_documento' => 'required|string|max:50|unique:usuarios,numero_documento',
            'telefono' => 'nullable|string|max:20',
            'correo' => 'required|string|email|max:150|unique:usuarios,correo',
            'contrasena' => 'required|string|min:6',
            'activo' => 'sometimes|boolean',
            'id_rol' => 'required|integer|exists:roles,id_rol',
        ];
    }
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'apellido.required' => 'El apellido es obligatorio.',
            'numero_documento.required' => 'El número de documento es obligatorio.',
            'numero_documento.unique' => 'El número de documento ya está en uso.',
            'correo.required' => 'El correo es obligatorio.',
            'correo.email' => 'El correo debe ser una dirección de correo válida.',
            'correo.unique' => 'El correo ya está en uso.',
            'contrasena.required' => 'La contraseña es obligatoria.',
            'contrasena.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'id_rol.required' => 'El rol es obligatorio.',
            'id_rol.exists' => 'El rol seleccionado no es válido.',
        ];
    }

}