<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudDemandadoExtra extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_demandados_extras';

    protected $primaryKey = 'id_solicitud_demandado_extra';

    protected $fillable = [
        'mesa_partes_virtual',
        'direccion_fiscal',
        'id_solicitud_parte'
    ];

    protected function casts(): array
    {
        return [
            'mesa_partes_virtual' => 'boolean',
        ];
    }

    public function solicitudParte()
    {
        return $this->belongsTo(SolicitudParte::class, 'id_solicitud_parte', 'id_solicitud_parte');
    }
}
