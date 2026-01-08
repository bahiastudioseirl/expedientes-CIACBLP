<?php

namespace App\DTOs\UsuariosSolicitante;

class CrearUsuarioSolicitanteDTO
{
    public function __construct(
        public ?string $nombre_completo,
        public string $numero_documento,
        public ?string $correo,
    )
    {}

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'] ?? null,
            numero_documento: $data['numero_documento'],
            correo: $data['correo'] ?? null,
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'] ?? null,
            numero_documento: $data['numero_documento'],
            correo: $data['correo'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'nombre_completo' => $this->nombre_completo,
            'numero_documento' => $this->numero_documento,
            'correo' => $this->correo,
        ]);
    }
}