<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpedienteParticipante extends Model
{
    use HasFactory;

    protected $table = 'expediente_participantes';
    protected $primaryKey = 'id_expediente_participante';

    protected $fillable = [
        'id_expediente',
        'id_usuario',
        'rol_en_expediente'
    ];
    
    public function expediente()
    {
        return $this->belongsTo(Expediente::class, 'id_expediente', 'id_expediente');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

}
