<?php

namespace App\DTOs\Usuarios;

class CrearUsuarioDTO
{
    public function __construct(
        public ?string $nombre_completo,
        public ?string $numero_documento,
        public string $correo,
        public ?string $contrasena = null,
        public ?string $telefono,
        public bool $activo = true,
        public int $id_rol,
    )
    {}

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'] ?? null,
            numero_documento: $data['numero_documento'] ?? null,
            correo: $data['correo'],
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null,
            activo: $data['activo'] ?? true,
            id_rol: $data['id_rol'] ?? 0,
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'] ?? null,
            numero_documento: $data['numero_documento'] ?? null,
            correo: $data['correo'],
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null,
            activo: $data['activo'] ?? true,
            id_rol: $data['id_rol'],
        );
    }

    public function toArray(): array
    {
        // Generar contraseña por defecto si no se proporciona
        $contrasena = $this->contrasena ?: $this->numero_documento;
        
        return array_filter([
            'nombre_completo' => $this->nombre_completo,
            'numero_documento' => $this->numero_documento,
            'correo' => $this->correo,
            'contrasena' => bcrypt($contrasena),
            'telefono' => $this->telefono,
            'activo' => $this->activo,
            'id_rol' => $this->id_rol
        ], function ($value) {
            return $value !== null && $value !== '';
        });
    }
}

