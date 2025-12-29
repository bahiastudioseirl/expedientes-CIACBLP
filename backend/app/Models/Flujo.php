<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flujo extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_flujo';

    protected $fillable = [
        'estado',
        'fecha_inicio',
        'fecha_fin',
        'id_expediente',
        'id_etapa',
        'id_subetapa',
    ];

    public function expediente()
    {
        return $this->belongsTo(Expediente::class, 'id_expediente', 'id_expediente');
    }

    public function etapa()
    {
        return $this->belongsTo(Etapa::class, 'id_etapa', 'id_etapa');
    }

    public function subetapa()
    {
        return $this->belongsTo(SubEtapa::class, 'id_subetapa', 'id_sub_etapa');
    }
    
}
