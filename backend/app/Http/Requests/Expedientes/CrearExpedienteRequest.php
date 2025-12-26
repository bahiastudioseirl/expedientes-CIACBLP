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
            'codigo_expediente' => 'required|string|max:255|unique:expedientes,codigo_expediente',
            'asunto' => 'required|string|max:500',
            'id_plantilla' => 'required|integer|exists:plantillas,id_plantilla',

            // Demandante - puede ser usuario existente o nuevo
            'demandante' => 'required|array',
            'demandante.numero_documento' => 'required|string|max:50',
            'demandante.nombre' => 'required|string|max:100',
            'demandante.apellido' => 'required|string|max:100',
            'demandante.telefono' => 'nullable|string|max:20',
            'demandante.correos' => 'required|array|min:1',
            'demandante.correos.*' => 'required|email|max:255',

            // Demandado - puede ser usuario existente o nuevo
            'demandado' => 'required|array',
            'demandado.numero_documento' => 'required|string|max:50',
            'demandado.nombre' => 'required|string|max:100',
            'demandado.apellido' => 'required|string|max:100',
            'demandado.telefono' => 'nullable|string|max:20',
            'demandado.correos' => 'required|array|min:1',
            'demandado.correos.*' => 'required|email|max:255',

            // Secretario Arbitral - puede ser usuario existente o nuevo
            'secretario_arbitral' => 'required|array',
            'secretario_arbitral.numero_documento' => 'required|string|max:50',
            'secretario_arbitral.nombre' => 'required|string|max:100',
            'secretario_arbitral.apellido' => 'required|string|max:100',
            'secretario_arbitral.telefono' => 'nullable|string|max:20',
            'secretario_arbitral.correos' => 'required|array|min:1',
            'secretario_arbitral.correos.*' => 'required|email|max:255',

            // Árbitro a cargo - puede ser usuario existente o nuevo
            'arbitro_a_cargo' => 'required|array',
            'arbitro_a_cargo.numero_documento' => 'required|string|max:50',
            'arbitro_a_cargo.nombre' => 'required|string|max:100',
            'arbitro_a_cargo.apellido' => 'required|string|max:100',
            'arbitro_a_cargo.telefono' => 'nullable|string|max:20',
            'arbitro_a_cargo.correos' => 'required|array|min:1',
            'arbitro_a_cargo.correos.*' => 'required|email|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'codigo_expediente.required' => 'El código del expediente es obligatorio.',
            'codigo_expediente.unique' => 'El código del expediente ya existe.',
            'asunto.required' => 'El asunto es obligatorio.',
            'id_plantilla.required' => 'La plantilla es obligatoria.',
            'id_plantilla.exists' => 'La plantilla seleccionada no es válida.',

            'demandante.required' => 'Los datos del demandante son obligatorios.',
            'demandante.numero_documento.required' => 'El número de documento del demandante es obligatorio.',
            'demandante.nombre.required' => 'El nombre del demandante es obligatorio.',
            'demandante.apellido.required' => 'El apellido del demandante es obligatorio.',
            'demandante.correos.required' => 'El demandante debe tener al menos un correo.',
            'demandante.correos.min' => 'El demandante debe tener al menos un correo.',

            'demandado.numero_documento.required' => 'El número de documento del demandado es obligatorio.',
            'demandado.nombre.required' => 'El nombre del demandado es obligatorio.',
            'demandado.apellido.required' => 'El apellido del demandado es obligatorio.',
            'demandado.correos.required' => 'El demandado debe tener al menos un correo.',
            'demandado.correos.min' => 'El demandado debe tener al menos un correo.',

            'secretario_arbitral.numero_documento.required' => 'El número de documento del secretario arbitral es obligatorio.',
            'secretario_arbitral.nombre.required' => 'El nombre del secretario arbitral es obligatorio.',
            'secretario_arbitral.apellido.required' => 'El apellido del secretario arbitral es obligatorio.',
            'secretario_arbitral.correos.required' => 'El secretario arbitral debe tener al menos un correo.',
            'secretario_arbitral.correos.min' => 'El secretario arbitral debe tener al menos un correo.',

            'arbitro_a_cargo.numero_documento.required' => 'El número de documento del árbitro es obligatorio.',
            'arbitro_a_cargo.nombre.required' => 'El nombre del árbitro es obligatorio.',
            'arbitro_a_cargo.apellido.required' => 'El apellido del árbitro es obligatorio.',
            'arbitro_a_cargo.correos.required' => 'El árbitro debe tener al menos un correo.',
            'arbitro_a_cargo.correos.min' => 'El árbitro debe tener al menos un correo.',
        ];
    }
}