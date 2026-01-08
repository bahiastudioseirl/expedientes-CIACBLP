<?php

namespace App\DTOs\Solicitudes\SolicitudDemandadoExtra;

class CrearSolicitudDemandadoExtraDTO
{
    public function __construct(
        public bool $mesa_partes_virtual,
        public ?string $direccion_fisica,
        public int $id_solicitud_parte
    ){}

    public static function fromRequest(array $data, int $id_solicitud_parte): self
    {
        return new self(
            mesa_partes_virtual: $data['mesa_partes_virtual'],
            direccion_fisica: $data['direccion_fisica'] ?? null,
            id_solicitud_parte: $id_solicitud_parte
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            mesa_partes_virtual: $data['mesa_partes_virtual'],
            direccion_fisica: $data['direccion_fisica'] ?? null,
            id_solicitud_parte: $data['id_solicitud_parte']
        );
    }

    public function toArray(): array
    {
        return [
            'mesa_partes_virtual' => $this->mesa_partes_virtual,
            'direccion_fisica' => $this->direccion_fisica,
            'id_solicitud_parte' => $this->id_solicitud_parte
        ];
    }
}