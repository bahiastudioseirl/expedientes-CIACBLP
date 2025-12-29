<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuariosMensajes extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_usuario_mensaje';

    protected $fillable = [
        'leido',
        'id_usuario',
        'id_mensaje',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    public function mensaje()
    {
        return $this->belongsTo(Mensajes::class, 'id_mensaje', 'id_mensaje');
    }

}
