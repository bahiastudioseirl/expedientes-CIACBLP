<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plantilla extends Model
{
    use HasFactory;

    protected $table = 'plantillas';
    protected $primaryKey = 'id_plantilla';

    protected $fillable = [
        'nombre',
        'activo'
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }


    public function etapas()
    {
        return $this->hasMany(Etapa::class, 'id_plantilla', 'id_plantilla');
    }

    
}
