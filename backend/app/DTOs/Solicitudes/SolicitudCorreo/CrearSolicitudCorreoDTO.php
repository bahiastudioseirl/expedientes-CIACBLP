<?php

namespace App\DTOs\Solicitudes\SolicitudCorreo;

class CrearSolicitudCorreoDTO
{
    public function __construct(
        public string $correo,
        public bool $es_principal,
        public int $id_solicitud_parte
    ){}

    public static function fromRequest(array $data, int $id_solicitud_parte): self
    {
        return new self(
            correo: $data['correo'],
            es_principal: $data['es_principal'] ?? false,
            id_solicitud_parte: $id_solicitud_parte
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            correo: $data['correo'],
            es_principal: $data['es_principal'] ?? false,
            id_solicitud_parte: $data['id_solicitud_parte']
        );
    }

    public function toArray(): array
    {
        return [
            'correo' => $this->correo,
            'es_principal' => $this->es_principal,
            'id_solicitud_parte' => $this->id_solicitud_parte
        ];
    }
}