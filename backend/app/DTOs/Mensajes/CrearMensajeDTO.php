<?php

namespace App\DTOs\Mensajes;

class CrearMensajeDTO
{
    public function __construct(
        public string $contenido,
        public int $id_asunto,
        public int $id_usuario
    )
    {}

    public static function fromRequest(array $data, int $id_usuario): self
    {
        return new self(
            contenido: $data['contenido'],
            id_asunto: $data['id_asunto'],
            id_usuario: $id_usuario
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            contenido: $data['contenido'],
            id_asunto: $data['id_asunto'],
            id_usuario: $data['id_usuario']
        );
    }

    

    public function toArray(): array
    {
        return array_filter([
            'contenido' => $this->contenido,
            'id_asunto' => $this->id_asunto,
            'id_usuario' => $this->id_usuario
        ], function ($value) {
            return $value !== null;
        });
    }
}