<?php

namespace App\DTOs\Usuarios;

class ActualizarUsuarioDTO
{
    public function __construct(
        public readonly ?string $nombre = null,
        public readonly ?string $apellido = null,
        public readonly ?string $numero_documento = null,
        public readonly ?string $nombre_empresa = null,
        public readonly ?string $contrasena = null,
        public readonly ?string $telefono = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            apellido: $data['apellido'] ?? null,
            numero_documento: $data['numero_documento'] ?? null,
            nombre_empresa: $data['nombre_empresa'] ?? null,
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null,
        );
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            apellido: $data['apellido'] ?? null,
            numero_documento: $data['numero_documento'] ?? null,
            nombre_empresa: $data['nombre_empresa'] ?? null,
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null
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
        if ($this->numero_documento !== null) {
            $result['numero_documento'] = $this->numero_documento;
        }
        if ($this->nombre_empresa !== null) {
            $result['nombre_empresa'] = $this->nombre_empresa;
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
