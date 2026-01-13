<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expediente extends Model
{
    use HasFactory;

    protected $table = 'expedientes';

    protected $primaryKey = 'id_expediente';

    protected $fillable = [
        'codigo_expediente',
        'id_plantilla',
        'id_solicitud',
        'activo'
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function plantilla()
    {
        return $this->belongsTo(Plantilla::class, 'id_plantilla', 'id_plantilla');
    }

    public function solicitud()
    {
        return $this->belongsTo(Solicitud::class, 'id_solicitud', 'id_solicitud');
    }

    public function flujos()
    {
        return $this->hasMany(Flujo::class, 'id_expediente', 'id_expediente');
    }

    public function asunto()
    {
        return $this->hasOne(Asunto::class, 'id_expediente', 'id_expediente');
    }
}
