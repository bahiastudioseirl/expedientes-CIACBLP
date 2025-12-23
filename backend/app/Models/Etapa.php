<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etapa extends Model
{
    use HasFactory;

    protected $table = 'etapas';
    protected $primaryKey = 'id_etapa';

    protected $fillable = [
        'nombre',
        'id_plantilla'
    ];

    public function plantilla()
    {
        return $this->belongsTo(Plantilla::class, 'id_plantilla', 'id_plantilla');
    }

    public function subEtapas()
    {
        return $this->hasMany(SubEtapa::class, 'id_etapa', 'id_etapa');
    }
}
