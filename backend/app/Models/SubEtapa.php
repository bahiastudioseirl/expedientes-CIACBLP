<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubEtapa extends Model
{
    use HasFactory;

    protected $table = 'sub_etapas';
    protected $primaryKey = 'id_sub_etapa';

    protected $fillable = [
        'nombre',
        'tiene_tiempo',
        'duracion_dias',
        'es_opcional',
        'id_etapa'
    ];

    protected function casts(): array
    {
        return [
            'tiene_tiempo' => 'boolean',
            'es_opcional' => 'boolean',
        ];
    }

    public function etapa()
    {
        return $this->belongsTo(Etapa::class, 'id_etapa', 'id_etapa');
    }
}
