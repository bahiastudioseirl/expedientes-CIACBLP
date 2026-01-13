<?php

namespace App\DTOs\Expedientes;

class CrearArbitroEnExpedienteDTO
{
    public function __construct(
        public readonly int $id_expediente,
        public readonly string $nombre_arbitro,
        public readonly string $numero_documento,
        public readonly string $correo_arbitro,
        public readonly ?string $telefono_arbitro = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            id_expediente: $data['id_expediente'],
            nombre_arbitro: $data['nombre_arbitro'],
            numero_documento: $data['numero_documento'],
            correo_arbitro: $data['correo_arbitro'],
            telefono_arbitro: $data['telefono_arbitro'] ?? null,
        );
    }
}