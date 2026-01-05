<?php

namespace App\Http\Requests\Usuarios;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CrearUsuarioEmpresaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'numero_documento' => 'required|string|max:50|unique:usuarios,numero_documento',
            'nombre_empresa' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'correos' => 'required|array|min:1',
            'correos.*' => 'required|email|max:150',
        ];
    }

    public function messages(): array
    {
        return [
            'numero_documento.required' => 'El número de documento es obligatorio.',
            'numero_documento.unique' => 'Este número de documento ya está registrado.',
            'nombre_empresa.required' => 'El nombre de la empresa es obligatorio.',
            'telefono.required' => 'El teléfono es obligatorio.',
            'correos.required' => 'Al menos un correo electrónico es obligatorio.',
            'correos.*.required' => 'Todos los correos son obligatorios.',
            'correos.*.email' => 'Los correos deben tener un formato válido.',
        ];
    }
}