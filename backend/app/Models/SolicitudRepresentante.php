<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudRepresentante extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_representantes';
    protected $primaryKey = 'id_solicitud_representante';

    protected $fillable = [
        'nombre_completo',
        'numero_documento',
        'telefono',
        'id_solicitud_parte'
    ];

    public function solicitudParte()
    {
        return $this->belongsTo(SolicitudParte::class, 'id_solicitud_parte', 'id_solicitud_parte');
    }

}
