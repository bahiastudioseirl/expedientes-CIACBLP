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
            'id_secretario_existente' => ['nullable', 'integer', 'exists:usuarios,id_usuario'],
            'nombre_secretario' => ['required_without:id_secretario_existente', 'string', 'max:255'],
            'correo_secretario' => ['required_without:id_secretario_existente', 'email', 'max:255', 'unique:usuarios,correo'],
            'telefono_secretario' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'id_secretario_existente.exists' => 'El secretario seleccionado no existe',
            
            'nombre_secretario.required_without' => 'El nombre del secretario es obligatorio cuando no se selecciona uno existente',
            'nombre_secretario.max' => 'El nombre del secretario no puede exceder 255 caracteres',
            
            'correo_secretario.required_without' => 'El correo del secretario es obligatorio cuando no se selecciona uno existente',
            'correo_secretario.email' => 'El correo del secretario debe ser válido',
            'correo_secretario.unique' => 'Este correo ya está registrado en el sistema',
            
            'telefono_secretario.max' => 'El teléfono no puede exceder 20 caracteres',
        ];
    }
}