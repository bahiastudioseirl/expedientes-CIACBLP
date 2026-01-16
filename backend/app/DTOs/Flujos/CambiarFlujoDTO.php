<?php

namespace App\DTOs\Flujos;

class CambiarFlujoDTO
{
    public function __construct(
        public int $id_expediente,
        public int $id_etapa,
        public ?int $id_subetapa = null,
        public ?string $fecha_inicio = null,
        public ?string $fecha_fin = null
    ){}

    public static function fromRequest(array $data, int $idExpediente): self
    {
        return new self(
            id_expediente: $idExpediente,
            id_etapa: $data['id_etapa'],
            id_subetapa: $data['id_subetapa'] ?? null,
            fecha_inicio: $data['fecha_inicio'] ?? null,
            fecha_fin: $data['fecha_fin'] ?? null
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id_expediente: $data['id_expediente'],
            id_etapa: $data['id_etapa'],
            id_subetapa: $data['id_subetapa'] ?? null,
            fecha_inicio: $data['fecha_inicio'] ?? null,
            fecha_fin: $data['fecha_fin'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'fecha_inicio' => $this->fecha_inicio,
            'fecha_fin' => $this->fecha_fin,
            'id_expediente' => $this->id_expediente,
            'id_etapa' => $this->id_etapa,
            'id_subetapa' => $this->id_subetapa
        ];
    }
}