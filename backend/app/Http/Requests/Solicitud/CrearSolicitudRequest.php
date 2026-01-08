<?php

namespace App\Http\Requests\Solicitud;

use Illuminate\Foundation\Http\FormRequest;

class CrearSolicitudRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Datos básicos
            'estado' => 'string|in:pendiente,en_proceso,completado',

            // Demandante
            'demandante.nombre_razon' => 'required|string|max:255',
            'demandante.numero_documento' => 'required|string|max:20',
            'demandante.telefono' => 'nullable|string|max:15',
            
            'correos_demandante' => 'required|array|min:1',
            'correos_demandante.*.correo' => 'required|email|max:255',
            'correos_demandante.*.es_principal' => 'boolean',
            
            'representante_demandante.nombre_completo' => 'nullable|string|max:255',
            'representante_demandante.numero_documento' => 'nullable|string|max:20',
            'representante_demandante.telefono' => 'nullable|string|max:15',

            // Demandado
            'demandado.nombre_razon' => 'required|string|max:255',
            'demandado.numero_documento' => 'required|string|max:20',
            'demandado.telefono' => 'nullable|string|max:15',
            
            'correos_demandado' => 'required|array|min:1',
            'correos_demandado.*.correo' => 'required|email|max:255',
            'correos_demandado.*.es_principal' => 'boolean',
            
            'representante_demandado.nombre_completo' => 'nullable|string|max:255',
            'representante_demandado.numero_documento' => 'nullable|string|max:20',
            'representante_demandado.telefono' => 'nullable|string|max:15',
            
            'demandado_extra.mesa_partes_virtual' => 'nullable|boolean',
            'demandado_extra.direccion_fisica' => 'nullable|string|max:255',

            // Resumen de la controversia
            'resumen_controversia' => 'required|string|max:1000',

            // Pretensiones
            'pretensiones' => 'required|array|min:1',
            'pretensiones.*.descripcion' => 'required|string|max:1000',
            'pretensiones.*.determinada' => 'required|boolean', // true: determinada, false: indeterminada
            'pretensiones.*.cuantia' => 'nullable|numeric|min:0',

            // Medida Cautelar
            'medida_cautelar' => 'nullable|string|max:500',

            // Designación Arbitral
            'designacion.arbitro_unico' => 'required|boolean',
            'designacion.propone_arbitro' => 'nullable|boolean',
            'designacion.encarga_ciacblp' => 'nullable|boolean',

            'arbitros' => 'required|array|min:1',
            'arbitros.*.nombre_completo' => 'required|string|max:255',
            'arbitros.*.correo' => 'nullable|email|max:255',
            'arbitros.*.telefono' => 'nullable|string|max:15',

            // Anexos
            'link_anexo' => 'nullable|string|url',

        ];
    }

    public function messages(): array
    {
        return [
            // Mensajes personalizados
            'resumen_controversia.required' => 'El resumen de la controversia es obligatorio.',
            'correos_demandante.required' => 'Debe proporcionar al menos un correo del demandante.',
            'correos_demandado.required' => 'Debe proporcionar al menos un correo del demandado.',
            'pretensiones.required' => 'Debe especificar al menos una pretensión.',
            'arbitros.required' => 'Debe proporcionar al menos un árbitro.',
            
            // Validaciones de correos
            'correos_demandante.*.correo.required' => 'Todos los correos del demandante son obligatorios.',
            'correos_demandante.*.correo.email' => 'Los correos del demandante deben ser válidos.',
            'correos_demandado.*.correo.required' => 'Todos los correos del demandado son obligatorios.',
            'correos_demandado.*.correo.email' => 'Los correos del demandado deben ser válidos.',
            
            // Pretensiones
            'pretensiones.*.descripcion.required' => 'La descripción de cada pretensión es obligatoria.',
            'pretensiones.*.determinada.required' => 'Debe especificar si la pretensión es determinada o indeterminada.',
            
            // Árbitros
            'arbitros.*.nombre_completo.required' => 'El nombre completo del árbitro es obligatorio.',
        ];
    }

    /**
     * Validaciones adicionales después de las reglas básicas
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validar que solo haya un correo principal por parte
            $this->validateCorreoPrincipal($validator, 'correos_demandante', 'demandante');
            $this->validateCorreoPrincipal($validator, 'correos_demandado', 'demandado');
            
            // Validar lógica de designación arbitral
            $this->validateDesignacionArbitral($validator);
            
            // Validar pretensiones con cuantía
            $this->validatePretensiones($validator);
        });
    }

    private function validateCorreoPrincipal($validator, string $field, string $parte): void
    {
        if (!$this->has($field)) return;

        $correos = $this->input($field, []);
        $principales = array_filter($correos, fn($c) => ($c['es_principal'] ?? false) === true);
        
        if (count($principales) === 0) {
            $validator->errors()->add($field, "Debe marcar un correo como principal para el {$parte}.");
        } elseif (count($principales) > 1) {
            $validator->errors()->add($field, "Solo puede haber un correo principal para el {$parte}.");
        }
    }

    private function validateDesignacionArbitral($validator): void
    {
        $designacion = $this->input('designacion', []);
        
        if (($designacion['arbitro_unico'] ?? false) === true) {
            // Si es árbitro único, debe especificar las opciones
            if (!isset($designacion['propone_arbitro']) && !isset($designacion['encarga_ciacblp'])) {
                $validator->errors()->add('designacion', 'Para árbitro único debe especificar si propone árbitro o encarga al CIACBLP.');
            }
        }
    }

    private function validatePretensiones($validator): void
    {
        $pretensiones = $this->input('pretensiones', []);
        
        foreach ($pretensiones as $index => $pretension) {
            if (($pretension['tipo'] ?? false) === true) {
                // Pretensión determinada debe tener cuantía
                if (!isset($pretension['cuantia']) || $pretension['cuantia'] === null) {
                    $validator->errors()->add("pretensiones.{$index}.cuantia", 'Las pretensiones determinadas deben especificar una cuantía.');
                }
            }
        }
    }
}