<?php

namespace App\Http\Requests\Mensajes;

use Illuminate\Foundation\Http\FormRequest;

class CrearMensajeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_asunto' => 'required|integer|exists:asuntos,id_asunto',
            'contenido' => 'required|string|max:5000',
            'usuarios_destinatarios' => 'required|array|min:1',
            'usuarios_destinatarios.*' => 'integer|exists:usuarios,id_usuario',
            'adjuntos' => 'nullable|array',
            'adjuntos.*' => 'file' 
        ];
    }

    public function messages(): array
    {
        return [
            'id_asunto.required' => 'El asunto es requerido',
            'id_asunto.exists' => 'El asunto seleccionado no existe',
            'contenido.required' => 'El contenido del mensaje es requerido',
            'contenido.max' => 'El contenido no puede exceder 5000 caracteres',
            'usuarios_destinatarios.required' => 'Debe seleccionar al menos un destinatario',
            'usuarios_destinatarios.array' => 'Los destinatarios deben ser un array',
            'usuarios_destinatarios.min' => 'Debe seleccionar al menos un destinatario',
            'usuarios_destinatarios.*.exists' => 'Uno o más destinatarios no existen',
            'adjuntos.array' => 'Los adjuntos deben ser un array',
            'adjuntos.*.file' => 'Cada adjunto debe ser un archivo válido',
        ];
    }
}