<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudPretension extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_pretensiones';
    protected $primaryKey = 'id_solicitud_pretension';

    protected $fillable = [
        'descripcion',
        'determinada',
        'cuantia',
        'id_solicitud'
    ];

    public function solicitud()
    {
        return $this->belongsTo(Solicitud::class, 'id_solicitud', 'id_solicitud');
    }
}
