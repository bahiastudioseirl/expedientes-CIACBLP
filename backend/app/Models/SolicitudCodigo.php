<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudCodigo extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_codigos';
    protected $primaryKey = 'id_solicitud_codigo';

    protected $fillable = [
        'codigo',
        'fecha_expiracion',
        'usado',
        'id_usuario_solicitante'
    ];

    protected function casts(): array
    {
        return [
            'usado' => 'boolean',
            'fecha_expiracion' => 'datetime',
        ];
    }

    public function usuarioSolicitante()
    {
        return $this->belongsTo(UsuarioSolicitante::class, 'id_usuario_solicitante', 'id_usuario_solicitante');
    }

}
