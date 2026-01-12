<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsuarioExpediente extends Model
{
    use HasFactory;

    protected $table = 'usuarios_expedientes';

    protected $primaryKey = 'id_usuario_expediente';

    protected $fillable = [
        'id_usuario',
        'id_expediente',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }

    public function expediente(): BelongsTo
    {
        return $this->belongsTo(Expediente::class, 'id_expediente', 'id_expediente');
    }
    
}