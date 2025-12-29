<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asunto extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_asunto';

    protected $fillable = [
        'titulo',
        'activo',
        'id_flujo',
        'id_expediente',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function flujo()
    {
        return $this->belongsTo(Flujo::class, 'id_flujo', 'id_flujo');
    }

    public function expediente()
    {
        return $this->belongsTo(Expediente::class, 'id_expediente', 'id_expediente');
    }

}