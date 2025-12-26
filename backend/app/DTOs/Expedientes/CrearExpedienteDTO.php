<?php

namespace App\DTOs\Expedientes;

class CrearExpedienteDTO
{
    public function __construct(
        public string $codigo_expediente,
        public string $asunto,
        public int $id_plantilla,
        public array $demandante,
        public array $demandado,
        public array $secretario_arbitral,
        public array $arbitro_a_cargo,
        public int $id_usuario // Usuario que crea el expediente (del JWT)
    ){}

    public static function fromRequest(array $data, int $id_usuario): self
    {
        return new self(
            codigo_expediente: $data['codigo_expediente'],
            asunto: $data['asunto'],
            id_plantilla: $data['id_plantilla'],
            demandante: $data['demandante'],
            demandado: $data['demandado'],
            secretario_arbitral: $data['secretario_arbitral'],
            arbitro_a_cargo: $data['arbitro_a_cargo'],
            id_usuario: $id_usuario
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            codigo_expediente: $data['codigo_expediente'],
            asunto: $data['asunto'],
            id_plantilla: $data['id_plantilla'],
            demandante: $data['demandante'],
            demandado: $data['demandado'],
            secretario_arbitral: $data['secretario_arbitral'],
            arbitro_a_cargo: $data['arbitro_a_cargo'],
            id_usuario: $data['id_usuario']
        );
    }

    public function toArray(): array
    {
        return [
            'codigo_expediente' => $this->codigo_expediente,
            'asunto' => $this->asunto,
            'id_plantilla' => $this->id_plantilla,
            'id_usuario' => $this->id_usuario
        ];
    }
}