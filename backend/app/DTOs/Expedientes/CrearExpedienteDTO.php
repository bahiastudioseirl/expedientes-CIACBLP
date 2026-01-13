<?php

namespace App\DTOs\Expedientes;

class CrearExpedienteDTO
{
    public function __construct(
        public readonly int $id_solicitud,
        public readonly string $nombre_secretario,
        public readonly string $correo_secretario,
        public readonly ?string $telefono_secretario = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            id_solicitud: $data['id_solicitud'],
            nombre_secretario: $data['nombre_secretario'],
            correo_secretario: $data['correo_secretario'],
            telefono_secretario: $data['telefono_secretario'] ?? null,
        );
    }
}