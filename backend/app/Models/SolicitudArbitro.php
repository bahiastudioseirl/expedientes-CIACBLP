<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudArbitro extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_arbitros';
    protected $primaryKey = 'id_solicitud_arbitro';

    protected $fillable = [
        'nombre_completo',
        'correo',
        'telefono',
        'id_solicitud_designacion'
    ];

    public function solicitudDesignacion()
    {
        return $this->belongsTo(SolicitudDesignacion::class, 'id_solicitud_designacion', 'id_solicitud_designacion');
    }
}
