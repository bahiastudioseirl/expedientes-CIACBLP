<?php

namespace App\DTOs\Solicitudes\SolicitudRepresentante;

class CrearSolicitudRepresentanteDTO
{
    public function __construct(
        public string $nombre_completo,
        public string $numero_documento,
        public ?string $telefono,
        public int $id_solicitud_parte
    ){}

    public static function fromRequest(array $data, int $id_solicitud_parte): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'],
            numero_documento: $data['numero_documento'],
            telefono: $data['telefono'] ?? null,
            id_solicitud_parte: $id_solicitud_parte
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'],
            numero_documento: $data['numero_documento'],
            telefono: $data['telefono'] ?? null,
            id_solicitud_parte: $data['id_solicitud_parte']
        );
    }

    public function toArray(): array
    {
        return [
            'nombre_completo' => $this->nombre_completo,
            'numero_documento' => $this->numero_documento,
            'telefono' => $this->telefono,
            'id_solicitud_parte' => $this->id_solicitud_parte
        ];
    }
}