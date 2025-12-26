<?php

namespace App\Models\SecondDB;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postulantes extends Model
{
    use HasFactory;

    protected $connection = 'mysql_second'; 
    protected $table = 'postulantes';
    protected $primaryKey = 'id';
    public $timestamps = false; 

    protected $fillable = [
        'nombres',
        'apellidos',
        'dni_pasaporte',
        'telefono',
        'correo',
        'aceptado',
        'estado',
        'postulante_acepto'
    ];

    protected $casts = [
        'aceptado' => 'boolean',
        'postulante_acepto' => 'boolean',
    ];

    public function scopeActivos($query)
    {
        return $query->where('aceptado', 1)
                    ->where('estado', 'activo')
                    ->where('postulante_acepto', 1);
    }

    public function getNombresFormateadosAttribute()
    {
        return ucwords(strtolower($this->nombres));
    }

    public function getApellidosFormateadosAttribute()
    {
        return ucwords(strtolower($this->apellidos));
    }

    public static function buscarPorDocumento($numeroDocumento)
    {
        return self::activos()
                   ->where('dni_pasaporte', $numeroDocumento)
                   ->first();
    }
}