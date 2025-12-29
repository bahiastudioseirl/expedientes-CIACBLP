<?php

namespace App\DTOs\Usuarios;

class CrearUsuarioDTO
{
    public function __construct(
        public string $nombre,
        public string $apellido,
        public ?string $nombre_empresa,
        public string $numero_documento,
        public string $contrasena,
        public ?string $telefono,
        public bool $activo = true,
        public int $id_rol,
    )
    {}

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre: $data['nombre'],
            apellido: $data['apellido'],
            nombre_empresa: $data['nombre_empresa'] ?? null,
            numero_documento: $data['numero_documento'],
            contrasena: $data['contrasena'],
            telefono: $data['telefono'],
            activo: $data['activo'] ?? true,
            id_rol: $data['id_rol']
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: $data['nombre'],
            apellido: $data['apellido'],
            nombre_empresa: $data['nombre_empresa'] ?? null,
            numero_documento: $data['numero_documento'],
            contrasena: $data['contrasena'],
            telefono: $data['telefono'] ?? null,
            activo: $data['activo'] ?? true,
            id_rol: $data['id_rol']
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'nombre_empresa' => $this->nombre_empresa,
            'numero_documento' => $this->numero_documento,
            'contrasena' => bcrypt($this->contrasena),
            'telefono' => $this->telefono,
            'activo' => $this->activo,
            'id_rol' => $this->id_rol
        ], function ($value) {
            return $value !== null;
        });
    }
}

