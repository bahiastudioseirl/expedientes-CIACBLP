<?php

namespace App\DTOs\Solicitudes\SolicitudDemandadoExtra;

class CrearSolicitudDemandadoExtraDTO
{
    public function __construct(
        public bool $mesa_partes_virtual,
        public ?string $direccion_fiscal,
        public int $id_solicitud_parte
    ){}

    public static function fromRequest(array $data, int $id_solicitud_parte): self
    {
        return new self(
            mesa_partes_virtual: $data['mesa_partes_virtual'],
            direccion_fiscal: $data['direccion_fiscal'] ?? null,
            id_solicitud_parte: $id_solicitud_parte
        );
    }

    public static function fromArray(array $data): self
    {
        
        $mesaPartesVirtual = $data['mesa_partes_virtual'];
        if (is_string($mesaPartesVirtual)) {
            $mesaPartesVirtual = in_array(strtolower($mesaPartesVirtual), ['1', 'true']);
        }
        $direccionFiscal = $mesaPartesVirtual ? null : ($data['direccion_fiscal'] ?? null);
        return new self(
            mesa_partes_virtual: (bool) $mesaPartesVirtual,
            direccion_fiscal: $direccionFiscal,
            id_solicitud_parte: $data['id_solicitud_parte']
        );
    }

    public function toArray(): array
    {
        return [
            'mesa_partes_virtual' => $this->mesa_partes_virtual,
            'direccion_fiscal' => $this->direccion_fiscal,
            'id_solicitud_parte' => $this->id_solicitud_parte
        ];
    }
}