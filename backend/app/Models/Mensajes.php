<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensajes extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_mensaje';

    protected $fillable = [
        'contenido',
        'fecha_envio',
        'id_usuario',
        'id_asunto',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    public function asunto()
    {
        return $this->belongsTo(Asunto::class, 'id_asunto', 'id_asunto');
    }

    public function adjuntos()
    {
        return $this->hasMany(Adjuntos::class, 'id_mensaje', 'id_mensaje');
    }

    public function usuariosMensajes()
    {
        return $this->hasMany(UsuariosMensajes::class, 'id_mensaje', 'id_mensaje');
    }


}
