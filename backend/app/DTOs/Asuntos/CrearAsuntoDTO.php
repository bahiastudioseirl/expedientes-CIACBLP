<?php

namespace App\DTOs\Asuntos;

class CrearAsuntoDTO
{
    public function __construct(
        public string $titulo,
        public int $id_flujo,
        public int $id_expediente
    ){}

    public static function fromRequest(array $data): self
    {
        return new self(
            titulo: $data['titulo'],
            id_flujo: $data['id_flujo'],
            id_expediente: $data['id_expediente']
        );
    }
    
    public static function fromArray(array $data): self
    {
        return new self(
            titulo: $data['titulo'],
            id_flujo: $data['id_flujo'],
            id_expediente: $data['id_expediente']
        );
    }

    public function toArray(): array
    {
        return [
            'titulo' => $this->titulo,
            'id_flujo' => $this->id_flujo,
            'id_expediente' => $this->id_expediente
        ];
    }
}