<?php

namespace App\DTOs\Flujos;

class ActualizarFlujoDTO
{
    public function __construct(
        public int $id_etapa,
        public ?int $id_subetapa
    ){}

    public static function fromRequest(array $data): self
    {
        return new self(
            id_etapa: $data['id_etapa'],
            id_subetapa: $data['id_subetapa'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'id_etapa' => $this->id_etapa,
            'id_subetapa' => $this->id_subetapa
        ];
    }
}