<?php

namespace App\Http\Requests\Expedientes;

use Illuminate\Foundation\Http\FormRequest;

class CrearArbitroEnExpedienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_arbitro' => ['required', 'string', 'max:255'],
            'numero_documento' => ['required', 'string', 'max:20'],
            'correo_arbitro' => ['required', 'email', 'max:255'],
            'telefono_arbitro' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_arbitro.required' => 'El nombre del árbitro es obligatorio',
            'nombre_arbitro.max' => 'El nombre del árbitro no puede exceder 255 caracteres',
            
            'numero_documento.required' => 'El número de documento es obligatorio',
            'numero_documento.max' => 'El número de documento no puede exceder 20 caracteres',
            
            'correo_arbitro.required' => 'El correo del árbitro es obligatorio',
            'correo_arbitro.email' => 'El correo del árbitro debe ser válido',
            'correo_arbitro.max' => 'El correo no puede exceder 255 caracteres',
            
            'telefono_arbitro.max' => 'El teléfono no puede exceder 20 caracteres',
        ];
    }
}
