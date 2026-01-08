<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudDesignacion extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_designaciones';
    protected $primaryKey = 'id_solicitud_designacion';

    protected $fillable = [
        'arbitro_unico',
        'propone_arbitro',
        'encarga_ciacblp',
        'id_solicitud'
    ];

    protected function casts(): array
    {
        return [
            'arbitro_unico' => 'boolean'
        ];
    }

    public function solicitud()
    {
        return $this->belongsTo(Solicitud::class, 'id_solicitud', 'id_solicitud');
    }

    public function arbitro()
    {
        return $this->hasOne(SolicitudArbitro::class, 'id_solicitud_designacion', 'id_solicitud_designacion');
    }
}
