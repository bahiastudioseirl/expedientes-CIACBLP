<?php

namespace App\DTOs\Plantillas;

class CrearPlantillaDTO
{
    public function __construct(
        public string $nombre,
        public bool $activo = true,
        public array $etapas = []
    )
    {}

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre: $data['nombre'],
            activo: $data['activo'] ?? true,
            etapas: $data['etapas'] ?? []
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: $data['nombre'],
            activo: $data['activo'] ?? true,
            etapas: $data['etapas'] ?? []
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'nombre' => $this->nombre,
            'activo' => $this->activo,
        ], function ($value) {
            return $value !== null;
        });
    }

    public function getEtapas(): array
    {
        return $this->etapas;
    }
}