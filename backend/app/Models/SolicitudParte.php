<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudParte extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_partes';
    protected $primaryKey = 'id_solicitud_parte';

    protected $fillable = [
        'tipo',
        'nombre_razon',
        'numero_documento',
        'telefono',
        'id_solicitud'
    ];

    public function solicitud()
    {
        return $this->belongsTo(Solicitud::class, 'id_solicitud', 'id_solicitud');
    }

    public function correos()
    {
        return $this->hasMany(SolicitudCorreo::class, 'id_solicitud_parte', 'id_solicitud_parte');
    }

    public function representante()
    {
        return $this->hasOne(SolicitudRepresentante::class, 'id_solicitud_parte', 'id_solicitud_parte');
    }

    public function demandadoExtra()
    {
        return $this->hasOne(SolicitudDemandadoExtra::class, 'id_solicitud_parte', 'id_solicitud_parte');
    }
}
