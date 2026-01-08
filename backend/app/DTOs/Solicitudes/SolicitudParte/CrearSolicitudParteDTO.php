<?php

namespace App\DTOs\Solicitudes\SolicitudParte;

class CrearSolicitudParteDTO
{
    public function __construct(
        private string $tipo,
        private string $nombre_razon,
        private string $numero_documento,
        private ?string $telefono = null,
        private int $id_solicitud
    )
    {}

    public static function fromRequest(array $data, int $id_solicitud): self
    {
        return new self(
            tipo: $data['tipo'],
            nombre_razon: $data['nombre_razon'],
            numero_documento: $data['numero_documento'],
            telefono: $data['telefono'] ?? null,
            id_solicitud: $id_solicitud
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            tipo: $data['tipo'],
            nombre_razon: $data['nombre_razon'],
            numero_documento: $data['numero_documento'],
            telefono: $data['telefono'] ?? null,
            id_solicitud: $data['id_solicitud']
        );
    }

    public function toArray(): array
    {
        return [
            'tipo' => $this->tipo,
            'nombre_razon' => $this->nombre_razon,
            'numero_documento' => $this->numero_documento,
            'telefono' => $this->telefono,
            'id_solicitud' => $this->id_solicitud
        ];
    }

    public function getTipo(): string
    {
        return $this->tipo;
    }

}