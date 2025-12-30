<?php

namespace App\Http\Requests\Flujos;

use Illuminate\Foundation\Http\FormRequest;

class CrearFlujoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_expediente' => 'required|integer|exists:expedientes,id_expediente',
            'id_etapa' => 'required|integer|exists:etapas,id_etapa',
            'id_subetapa' => 'nullable|integer|exists:sub_etapas,id_sub_etapa',
            'asunto' => 'required|string|max:500'
        ];
    }

    public function messages(): array
    {
        return [
            'id_expediente.required' => 'El expediente es requerido',
            'id_expediente.exists' => 'El expediente no existe',
            'id_etapa.required' => 'La etapa es requerida',
            'id_etapa.exists' => 'La etapa no existe',
            'id_subetapa.exists' => 'La subetapa no existe',
            'asunto.required' => 'El asunto es requerido',
            'asunto.max' => 'El asunto no puede tener más de 500 caracteres'
        ];
    }
}