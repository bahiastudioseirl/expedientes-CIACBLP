<?php

namespace App\Http\Requests\Flujos;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarFlujoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_etapa' => 'required|integer|exists:etapas,id_etapa',
            'id_subetapa' => 'nullable|integer|exists:sub_etapas,id_sub_etapa',
            'asunto' => 'nullable|string|max:500'
        ];
    }

    public function messages(): array
    {
        return [
            'id_etapa.required' => 'La etapa es requerida',
            'id_etapa.exists' => 'La etapa no existe',
            'id_subetapa.exists' => 'La subetapa no existe',
            'asunto.max' => 'El asunto no puede tener más de 500 caracteres'
        ];
    }
}