<?php

namespace App\DTOs\Usuarios;

class CrearUsuarioDTO
{
    public function __construct(
        public ?string $nombre,
        public ?string $apellido,
        public ?string $nombre_empresa,
        public string $numero_documento,
        public ?string $contrasena = null,
        public ?string $telefono,
        public bool $activo = true,
        public int $id_rol,
        public array $correos = [],
    )
    {}

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            apellido: $data['apellido'] ?? null,
            nombre_empresa: $data['nombre_empresa'] ?? null,
            numero_documento: $data['numero_documento'],
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'],
            activo: $data['activo'] ?? true,
            id_rol: $data['id_rol'] ?? 0,
            correos: $data['correos'] ?? []
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            apellido: $data['apellido'] ?? null,
            nombre_empresa: $data['nombre_empresa'] ?? null,
            numero_documento: $data['numero_documento'],
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null,
            activo: $data['activo'] ?? true,
            id_rol: $data['id_rol'],
            correos: $data['correos'] ?? []
        );
    }

    public function toArray(): array
    {
        // Generar contraseña por defecto si no se proporciona
        $contrasena = $this->contrasena ?: $this->numero_documento;
        
        return array_filter([
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'nombre_empresa' => $this->nombre_empresa,
            'numero_documento' => $this->numero_documento,
            'contrasena' => bcrypt($contrasena),
            'telefono' => $this->telefono,
            'activo' => $this->activo,
            'id_rol' => $this->id_rol
            // No incluimos 'correos' aquí ya que se manejan separadamente
        ], function ($value) {
            return $value !== null && $value !== '';
        });
    }
}

