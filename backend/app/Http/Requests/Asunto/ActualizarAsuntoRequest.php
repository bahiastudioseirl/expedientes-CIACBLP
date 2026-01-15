<?php

namespace App\Http\Requests\Asunto;

use Illuminate\Foundation\Http\FormRequest;

class ActualizarAsuntoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
			'id_expediente' => 'required|integer|exists:expedientes,id_expediente',            
            'titulo' => 'sometimes|string',
        ];
    }

    public function messages(): array
    {
        return [
            'id_expediente.required' => 'El campo id_expediente es obligatorio.',
            'titulo.sometimes' => 'El campo título es opcional.',
            'titulo.string' => 'El campo título debe ser una cadena de texto.',
        ];
    }
} 