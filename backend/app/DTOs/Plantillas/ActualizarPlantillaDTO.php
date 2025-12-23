<?php 

namespace App\DTOs\Plantillas;

class ActualizarPlantillaDTO
{
    public function __construct(
        public readonly ?string $nombre = null,
        public readonly ?bool $activo = null,
        public readonly ?array $etapas = null
    )
    {}

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            activo: $data['activo'] ?? null,
            etapas: $data['etapas'] ?? null
        );
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            activo: $data['activo'] ?? null,
            etapas: $data['etapas'] ?? null
        );
    }

    public function toArray(): array
    {
        $result = [];
        if ($this->nombre !== null) {
            $result['nombre'] = $this->nombre;
        }
        if ($this->activo !== null) {
            $result['activo'] = $this->activo;
        }
        return $result;
    }

    public function getEtapas(): ?array
    {
        return $this->etapas;
    }
}
