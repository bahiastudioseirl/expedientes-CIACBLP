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
        'mensaje_padre_id',
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

    // Relaciones para threading
    public function mensajePadre()
    {
        return $this->belongsTo(Mensajes::class, 'mensaje_padre_id', 'id_mensaje');
    }

    public function respuestas()
    {
        return $this->hasMany(Mensajes::class, 'mensaje_padre_id', 'id_mensaje');
    }

    public function scopeMensajesPrincipales($query)
    {
        return $query->whereNull('mensaje_padre_id');
    }

    public function scopeRespuestas($query)
    {
        return $query->whereNotNull('mensaje_padre_id');
    }

    // Métodos helper
    public function esMensajePrincipal()
    {
        return is_null($this->mensaje_padre_id);
    }

    public function esRespuesta()
    {
        return !is_null($this->mensaje_padre_id);
    }

    public function obtenerHiloCompleto()
    {
        if ($this->esMensajePrincipal()) {
            return $this->respuestas()->with(['usuario', 'respuestas'])->orderBy('fecha_envio')->get();
        } else {
            return $this->mensajePadre->respuestas()->with(['usuario'])->orderBy('fecha_envio')->get();
        }
    }


}
