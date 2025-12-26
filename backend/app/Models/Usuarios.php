<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuarios extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'nombre',
        'apellido',
        'numero_documento',
        'contrasena',
        'telefono',
        'activo',
        'id_rol'
    ];

    protected $hidden = [
        'contrasena',
    ];

    private $contrasenaTextoPlano = null;

    protected function casts(): array
    {
        return [
            'contrasena' => 'hashed',
            'activo' => 'boolean',
        ];
    }

    public function setContrasenaTextoPlano($value)
    {
        $this->contrasenaTextoPlano = $value;
        $this->contrasena = $value;
    }

    public function getContrasenaTextoPlanoAttribute()
    {
        return $this->contrasenaTextoPlano;
    }

    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    public function getAuthIdentifierName()
    {
        return 'numero_documento';
    }
        public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'numero_documento' => $this->numero_documento,
        ];
    }

    public function rol()
    {
        return $this->belongsTo(Roles::class, 'id_rol', 'id_rol');
    }

    public function correos()
    {
        return $this->hasMany(Correos::class, 'id_usuario', 'id_usuario');
    }
    
}
