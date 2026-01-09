<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    use HasFactory;
    
    protected $table = 'solicitudes';
    protected $primaryKey = 'id_solicitud';

    protected $fillable = [
        'estado',
        'resumen_controversia',
        'resumen_controversia_tipo',
        'resumen_controversia_archivo',
        'medida_cautelar',
        'link_anexo',
        'id_usuario_solicitante'
    ];

    public function usuarioSolicitante()
    {
        return $this->belongsTo(UsuarioSolicitante::class, 'id_usuario_solicitante', 'id_usuario_solicitante');
    }

    public function partes()
    {
        return $this->hasMany(SolicitudParte::class, 'id_solicitud', 'id_solicitud');
    }

    public function pretensiones()
    {
        return $this->hasMany(SolicitudPretension::class, 'id_solicitud', 'id_solicitud');
    }

    public function designacion()
    {
        return $this->hasOne(SolicitudDesignacion::class, 'id_solicitud', 'id_solicitud');
    }
}
