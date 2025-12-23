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
            'etapas.*.sub_etapas' => 'required|array|min:1',
            'etapas.*.sub_etapas.*.nombre' => 'sometimes|string|max:255',
            'etapas.*.sub_etapas.*.tiene_tiempo' => 'required|boolean',
            'etapas.*.sub_etapas.*.duracion_dias' => 'nullable|integer|min:1|required_if:etapas.*.sub_etapas.*.tiene_tiempo,true',
            'etapas.*.sub_etapas.*.es_opcional' => 'required|boolean',
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
            'etapas.*.sub_etapas.*.tiene_tiempo.required' => 'Debe especificar si la sub-etapa tiene tiempo.',
            'etapas.*.sub_etapas.*.tiene_tiempo.boolean' => 'El campo tiene_tiempo debe ser verdadero o falso.',
            'etapas.*.sub_etapas.*.duracion_dias.required_if' => 'La duración en días es obligatoria cuando la sub-etapa tiene tiempo.',
            'etapas.*.sub_etapas.*.duracion_dias.integer' => 'La duración debe ser un número entero.',
            'etapas.*.sub_etapas.*.duracion_dias.min' => 'La duración debe ser al menos 1 día.',
            'etapas.*.sub_etapas.*.es_opcional.required' => 'Debe especificar si la sub-etapa es opcional.',
            'etapas.*.sub_etapas.*.es_opcional.boolean' => 'El campo es_opcional debe ser verdadero o falso.',
        ];
    }
}