<?php

namespace App\Http\Requests\Expedientes;

use Illuminate\Foundation\Http\FormRequest;

class CrearExpedienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_secretario' => ['required', 'string', 'max:255'],
            'correo_secretario' => ['required', 'email', 'max:255', 'unique:users,email'],
            'telefono_secretario' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_secretario.required' => 'El nombre del secretario es obligatorio',
            'nombre_secretario.max' => 'El nombre del secretario no puede exceder 255 caracteres',
            
            'correo_secretario.required' => 'El correo del secretario es obligatorio',
            'correo_secretario.email' => 'El correo del secretario debe ser válido',
            'correo_secretario.unique' => 'Este correo ya está registrado en el sistema',
            
            'telefono_secretario.max' => 'El teléfono no puede exceder 20 caracteres',
        ];
    }
}