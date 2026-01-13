<?php

namespace App\DTOs\Expedientes;

class CrearExpedienteDTO
{
    public function __construct(
        public readonly ?string $codigo_expediente,
        public readonly ?int $id_plantilla,
        public readonly int $id_solicitud,
        public readonly bool $activo
    ){}

    public static function fromRequest(array $data): self
    {
        return new self(
            codigo_expediente: $data['codigo_expediente'] ?? null,
            id_plantilla: $data['id_plantilla'] ?? null,
            id_solicitud: $data['id_solicitud'],
            activo: $data['activo'] ?? true,
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            codigo_expediente: $data['codigo_expediente'] ?? null,
            id_plantilla: $data['id_plantilla'] ?? null,
            id_solicitud: $data['id_solicitud'],
            activo: $data['activo'] ?? true,
        );
    }

    public function toArray(): array
    {
        return [
            'codigo_expediente' => $this->codigo_expediente,
            'id_plantilla' => $this->id_plantilla,
            'id_solicitud' => $this->id_solicitud,
            'activo' => $this->activo,
        ];
    }

}