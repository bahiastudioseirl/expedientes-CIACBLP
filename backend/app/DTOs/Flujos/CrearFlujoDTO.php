<?php

namespace App\DTOs\Flujos;

class CrearFlujoDTO
{
    public function __construct(
        public string $estado,
        public ?string $fecha_inicio,
        public ?string $fecha_fin,
        public int $id_expediente,
        public int $id_etapa,
        public ?int $id_subetapa
    ){}

    public static function fromRequest(array $data): self
    {
        return new self(
            estado: $data['estado'],
            fecha_inicio: $data['fecha_inicio'] ?? null,
            fecha_fin: $data['fecha_fin'] ?? null,
            id_expediente: $data['id_expediente'],
            id_etapa: $data['id_etapa'],
            id_subetapa: $data['id_subetapa'] ?? null
        );
    }
    
    public static function fromArray(array $data): self
    {
        return new self(
            estado: $data['estado'],
            fecha_inicio: $data['fecha_inicio'] ?? null,
            fecha_fin: $data['fecha_fin'] ?? null,
            id_expediente: $data['id_expediente'],
            id_etapa: $data['id_etapa'],
            id_subetapa: $data['id_subetapa'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'estado' => $this->estado,
            'fecha_inicio' => $this->fecha_inicio,
            'fecha_fin' => $this->fecha_fin,
            'id_expediente' => $this->id_expediente,
            'id_etapa' => $this->id_etapa,
            'id_subetapa' => $this->id_subetapa
        ];
    }
}