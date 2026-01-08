<?php

namespace App\DTOs\Solicitudes\SolicitudPretension;

class CrearSolicitudPretensionDTO{

    public function __construct(
        private string $descripcion,
        private bool $determinada,
        private ?float $cuantia,
        private int $id_solicitud
    )
    {}

    public static function fromRequest(array $data, int $id_solicitud): self
    {
        return new self(
            descripcion: $data['descripcion'],
            determinada: $data['determinada'],
            cuantia: $data['cuantia'] ?? null,
            id_solicitud: $id_solicitud
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            descripcion: $data['descripcion'],
            determinada: $data['determinada'],
            cuantia: $data['cuantia'] ?? null,
            id_solicitud: $data['id_solicitud']
        );
    }

    public function toArray(): array
    {
        return [
            'descripcion' => $this->descripcion,
            'determinada' => $this->determinada,
            'cuantia' => $this->cuantia,
            'id_solicitud' => $this->id_solicitud
        ];
    }


}
