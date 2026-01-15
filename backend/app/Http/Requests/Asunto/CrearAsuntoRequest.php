<?php

namespace App\Http\Requests\Asunto;

use Illuminate\Foundation\Http\FormRequest;

class CrearAsuntoRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'id_expediente' => 'required|integer|exists:expedientes,id_expediente',
			'titulo' => 'required|string|max:255',
		];
	}

    public function messages(): array
    {
        return [
            'id_expediente.required' => 'El campo id_expediente es obligatorio.',
            'id_expediente.integer' => 'El campo id_expediente debe ser un número entero.',
            'id_expediente.exists' => 'El expediente especificado no existe.',
            'titulo.required' => 'El campo título es obligatorio.',
            'titulo.string' => 'El campo título debe ser una cadena de texto.',
            'titulo.max' => 'El campo título no debe exceder los 255 caracteres.',
        ];
    }
}