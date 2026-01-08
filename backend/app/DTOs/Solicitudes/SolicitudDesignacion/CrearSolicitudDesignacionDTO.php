<?php

namespace App\DTOs\Solicitudes\SolicitudDesignacion;

class CrearSolicitudDesignacionDTO
{
    public function __construct(
        public bool $arbitro_unico,
        public ?bool $propone_arbitro,
        public ?bool $encarga_ciacblp,
        public int $id_solicitud
    ){}

    public static function fromRequest(array $data, int $id_solicitud): self
    {
        return new self(
            arbitro_unico: $data['arbitro_unico'],
            propone_arbitro: $data['propone_arbitro'] ?? null,
            encarga_ciacblp: $data['encarga_ciacblp'] ?? null,
            id_solicitud: $id_solicitud
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            arbitro_unico: $data['arbitro_unico'],
            propone_arbitro: $data['propone_arbitro'] ?? null,
            encarga_ciacblp: $data['encarga_ciacblp'] ?? null,
            id_solicitud: $data['id_solicitud']
        );
    }

    public function toArray(): array
    {
        return [
            'arbitro_unico' => $this->arbitro_unico,
            'propone_arbitro' => $this->propone_arbitro,
            'encarga_ciacblp' => $this->encarga_ciacblp,
            'id_solicitud' => $this->id_solicitud
        ];
    }
}