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
        'asunto',
        'id_plantilla',
        'id_usuario',
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

    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    public function participantes()
    {
        return $this->hasMany(ExpedienteParticipante::class, 'id_expediente', 'id_expediente');
    }
}
