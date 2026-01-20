<?php

namespace App\DTOs\Usuarios;

class AgregarUsuarioExpedienteDTO
{
    public function __construct(
        public string $correo,
        public string $tipo,
    )
    {}

    public static function fromRequest(array $data): self
    {
        return new self(
            correo: $data['correo'],
            tipo: $data['tipo'],
        );
    }

    public function fromArray(array $data): self
    {
        return new self(
            correo: $data['correo'],
            tipo: $data['tipo'],
        );
    }   

    public function toArray(): array
    {
        return [
            'correo' => $this->correo,
            'tipo' => $this->tipo,
        ];
    }
}