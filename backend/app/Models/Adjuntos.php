<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adjuntos extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_adjunto';

    protected $fillable = [
        'ruta_archivo',
        'id_mensaje',
    ];

    public function mensaje()
    {
        return $this->belongsTo(Mensajes::class, 'id_mensaje', 'id_mensaje');
    }


}
