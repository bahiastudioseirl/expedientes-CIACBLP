<?php

namespace App\DTOs\Solicitudes\SolicitudArbitro;

class CrearSolicitudArbitroDTO
{
    public function __construct(
        public string $nombre_completo,
        public ?string $correo,
        public ?string $telefono,
        public int $id_solicitud_designacion
    ){}

    public static function fromRequest(array $data, int $id_solicitud_designacion): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'],
            correo: $data['correo'] ?? null,
            telefono: $data['telefono'] ?? null,
            id_solicitud_designacion: $id_solicitud_designacion
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'],
            correo: $data['correo'] ?? null,
            telefono: $data['telefono'] ?? null,
            id_solicitud_designacion: $data['id_solicitud_designacion']
        );
    }

    public function toArray(): array
    {
        return [
            'nombre_completo' => $this->nombre_completo,
            'correo' => $this->correo,
            'telefono' => $this->telefono,
            'id_solicitud_designacion' => $this->id_solicitud_designacion
        ];
    }
}