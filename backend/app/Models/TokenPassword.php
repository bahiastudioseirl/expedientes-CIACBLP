<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TokenPassword extends Model
{
    use HasFactory;

    protected $table = 'tokens_passwords';

    protected $primaryKey = 'id_token';

    protected $fillable = [
        'token',
        'fecha_expiracion',
        'usado',
        'id_usuario',
    ];

    protected function casts(): array
    {
        return [
            'fecha_expiracion' => 'datetime',
            'usado' => 'boolean',
        ];
    }

    public function usuario()
    {
        return $this->belongsTo(Usuarios::class, 'id_usuario', 'id_usuario');
    }


}
