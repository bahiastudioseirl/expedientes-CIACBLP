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
        'id_etapa',
        'nombre',
        'descripcion',
        'orden',
        'dias_habiles',
        'es_habil',
        'es_obligatorio',
    ];

    protected function casts(): array
    {
        return [
            'es_habil' => 'boolean',
            'es_obligatorio' => 'boolean',
        ];
    }

    public function etapa()
    {
        return $this->belongsTo(Etapa::class, 'id_etapa', 'id_etapa');
    }
}
