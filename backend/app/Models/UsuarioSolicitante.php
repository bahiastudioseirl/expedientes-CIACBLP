<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;

class UsuarioSolicitante extends Model implements JWTSubject
{
    use HasFactory;

    protected $table = 'usuarios_solicitantes';
    protected $primaryKey = 'id_usuario_solicitante';

    protected $fillable = [
        'nombre_completo',
        'numero_documento',
        'correo'
    ];

    public function solicitudesCodigos()
    {
        return $this->hasMany(SolicitudCodigo::class, 'id_usuario_solicitante', 'id_usuario_solicitante');
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class, 'id_usuario_solicitante', 'id_usuario_solicitante');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'id_usuario_solicitante' => $this->id_usuario_solicitante,
            'numero_documento' => $this->numero_documento,
            'tipo_usuario' => 'solicitante'
        ];
    }
}
