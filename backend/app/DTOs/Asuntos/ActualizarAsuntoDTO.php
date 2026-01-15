<?php

namespace App\DTOs\Asuntos;

class ActualizarAsuntoDTO
{
    public function __construct(
        public ?int $id_expediente,
        public ?string $titulo,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            id_expediente: $data['id_expediente'] ?? null,
            titulo: $data['titulo'] ?? null
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id_expediente: $data['id_expediente'] ?? null,
            titulo: $data['titulo'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'id_expediente' => $this->id_expediente,
            'titulo' => $this->titulo
        ];
    }
}
