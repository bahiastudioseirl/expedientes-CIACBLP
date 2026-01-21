<?php

namespace App\DTOs\Expedientes;

class CrearExpedienteDTO
{
    public function __construct(
        public readonly int $id_solicitud,
        public readonly ?int $id_secretario_existente = null,
        public readonly ?string $nombre_secretario = null,
        public readonly ?string $correo_secretario = null,
        public readonly ?string $telefono_secretario = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            id_solicitud: $data['id_solicitud'],
            id_secretario_existente: $data['id_secretario_existente'] ?? null,
            nombre_secretario: $data['nombre_secretario'] ?? null,
            correo_secretario: $data['correo_secretario'] ?? null,
            telefono_secretario: $data['telefono_secretario'] ?? null,
        );
    }
}