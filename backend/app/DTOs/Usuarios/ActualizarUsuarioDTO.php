<?php

namespace App\DTOs\Usuarios;

class ActualizarUsuarioDTO
{
    public function __construct(
        public readonly ?string $nombre = null,
        public readonly ?string $apellido = null,
        public readonly ?string $numeroDocumento = null,
        public readonly ?string $nombreEmpresa = null,
        public readonly ?string $contrasena = null,
        public readonly ?string $telefono = null,
        public readonly ?array $correos = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            apellido: $data['apellido'] ?? null,
            numeroDocumento: $data['numero_documento'] ?? null,
            nombreEmpresa: $data['nombre_empresa'] ?? null,
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null,
            correos: $data['correos'] ?? null,
        );
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            apellido: $data['apellido'] ?? null,
            numeroDocumento: $data['numero_documento'] ?? null,
            nombreEmpresa: $data['nombre_empresa'] ?? null,
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null,
            correos: $data['correos'] ?? null
        );
    }

    public function toArray(): array
    {
        $result = [];
        if ($this->nombre !== null) {
            $result['nombre'] = $this->nombre;
        }
        if ($this->apellido !== null) {
            $result['apellido'] = $this->apellido;
        }
        if ($this->numeroDocumento !== null) {
            $result['numero_documento'] = $this->numeroDocumento;
        }
        if ($this->nombreEmpresa !== null) {
            $result['nombre_empresa'] = $this->nombreEmpresa;
        }
        if ($this->contrasena !== null) {
            $result['contrasena'] = bcrypt($this->contrasena);
        }
        if ($this->telefono !== null) {
            $result['telefono'] = $this->telefono;
        }
        return $result;
    }
}
