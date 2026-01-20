<?php

namespace App\DTOs\Usuarios;

class AgregarUsuarioExpedienteDTO
{
    public function __construct(
        public int $id_usuario
    )
    {}

    public static function fromRequest(array $data): self
    {
        return new self(
            id_usuario: $data['id_usuario'],
        );
    }

    public function toArray(): array
    {
        return [
            'id_usuario' => $this->id_usuario,
        ];
    }

    public function fromArray(array $data): self
    {
        return new self(
            id_usuario: $data['id_usuario'],
        );
    }
}