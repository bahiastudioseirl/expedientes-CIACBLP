<?php

namespace App\Http\Requests\Plantillas;

use Illuminate\Foundation\Http\FormRequest;

class CrearPlantillaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'activo' => 'sometimes|boolean',
            
            'etapas' => 'required|array|min:1',
            'etapas.*.nombre' => 'required|string|max:255',
            'etapas.*.orden' => 'required|integer|min:1',
            'etapas.*.sub_etapas' => 'required|array|min:1',
            'etapas.*.sub_etapas.*.nombre' => 'sometimes|string|max:255',
            'etapas.*.sub_etapas.*.orden' => 'required|integer|min:1',
            'etapas.*.sub_etapas.*.dias_habiles' => 'required|integer|min:0',
            'etapas.*.sub_etapas.*.es_habil' => 'required|boolean',
            'etapas.*.sub_etapas.*.descripcion' => 'nullable|string',
            'etapas.*.sub_etapas.*.es_obligatorio' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre de la plantilla es obligatorio.',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres.',
            
            'etapas.required' => 'Debe incluir al menos una etapa.',
            'etapas.array' => 'Las etapas deben ser un array.',
            'etapas.min' => 'Debe incluir al menos una etapa.',
            'etapas.*.nombre.required' => 'El nombre de la etapa es obligatorio.',
            'etapas.*.nombre.max' => 'El nombre de la etapa no puede exceder 255 caracteres.',
            
            'etapas.*.sub_etapas.required' => 'Cada etapa debe tener al menos una sub-etapa.',
            'etapas.*.sub_etapas.array' => 'Las sub-etapas deben ser un array.',
            'etapas.*.sub_etapas.min' => 'Cada etapa debe tener al menos una sub-etapa.',
            'etapas.*.sub_etapas.*.nombre.max' => 'El nombre de la sub-etapa no puede exceder 255 caracteres.',
            'etapas.*.sub_etapas.*.orden.required' => 'El orden de la sub-etapa es obligatorio.',
            'etapas.*.sub_etapas.*.orden.integer' => 'El orden debe ser un número entero.',
            'etapas.*.sub_etapas.*.orden.min' => 'El orden debe ser al menos 1.',
            'etapas.*.sub_etapas.*.dias_habiles.required' => 'Los días hábiles son obligatorios.',
            'etapas.*.sub_etapas.*.dias_habiles.integer' => 'Los días hábiles deben ser un número entero.',
            'etapas.*.sub_etapas.*.dias_habiles.min' => 'Los días hábiles no pueden ser negativos.',
            'etapas.*.sub_etapas.*.es_habil.required' => 'Debe especificar si la sub-etapa es hábil.',
            'etapas.*.sub_etapas.*.es_habil.boolean' => 'El campo es_habil debe ser verdadero o falso.',
            'etapas.*.sub_etapas.*.descripcion.string' => 'La descripción debe ser texto.',
            'etapas.*.sub_etapas.*.es_obligatorio.required' => 'Debe especificar si la sub-etapa es obligatoria.',
            'etapas.*.sub_etapas.*.es_obligatorio.boolean' => 'El campo es_obligatorio debe ser verdadero o falso.',
        ];
    }
}