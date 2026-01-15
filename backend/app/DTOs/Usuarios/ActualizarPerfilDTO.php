<?php

namespace App\DTOs\Usuarios;

class ActualizarPerfilDTO
{
    public function __construct(
        public readonly int $id_usuario,
        public readonly string $nombre_completo
    ) {}

    public static function fromRequest(array $data, int $idUsuario): self
    {
        return new self(
            id_usuario: $idUsuario,
            nombre_completo: trim($data['nombre_completo'])
        );
    }

    public function toArray(): array
    {
        return [
            'id_usuario' => $this->id_usuario,
            'nombre_completo' => $this->nombre_completo
        ];
    }
}