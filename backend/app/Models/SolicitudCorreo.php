<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudCorreo extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_correos';
    protected $primaryKey = 'id_solicitud_correo';

    protected $fillable = [
        'correo',
        'es_principal',
        'id_solicitud_parte'
    ];

    protected function casts(): array
    {
        return [
            'es_principal' => 'boolean',
        ];
    }

    public function solicitudParte()
    {
        return $this->belongsTo(SolicitudParte::class, 'id_solicitud_parte', 'id_solicitud_parte');
    }

    
}
