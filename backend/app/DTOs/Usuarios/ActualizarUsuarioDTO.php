<?php

namespace App\DTOs\Usuarios;

class ActualizarUsuarioDTO
{
    public function __construct(
        public readonly ?string $nombre_completo = null,
        public readonly ?string $numero_documento = null,
        public readonly ?string $correo = null,
        public readonly ?string $contrasena = null,
        public readonly ?string $telefono = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'] ?? null,
            numero_documento: $data['numero_documento'] ?? null,
            correo: $data['correo'] ?? null,
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null,
        );
    }

    public static function fromRequest(array $data): self
    {
        return new self(
            nombre_completo: $data['nombre_completo'] ?? null,
            numero_documento: $data['numero_documento'] ?? null,
            correo: $data['correo'] ?? null,
            contrasena: $data['contrasena'] ?? null,
            telefono: $data['telefono'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'nombre_completo' => $this->nombre_completo,
            'numero_documento' => $this->numero_documento,
            'correo' => $this->correo,
            'contrasena' => $this->contrasena ? bcrypt($this->contrasena) : null,
            'telefono' => $this->telefono,
        ], function ($value) {
            return $value !== null && $value !== '';
        });
    }
}
