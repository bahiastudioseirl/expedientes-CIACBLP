<?php

namespace Database\Seeders;

use App\Models\Usuarios;
use Illuminate\Database\Seeder;

class UsuariosSeeder extends Seeder
{
    public function run():void
    {
        $usuarios = [
            [
                'nombre_completo' => 'Victor Chavez',
                'numero_documento' => '77777777',
                'correo' => 'admindev@bahia.pe',
                'contrasena' => 'admindev@bahia.pe',
                'telefono' => '123456789',
                'activo' => true,
                'id_rol' => 1
            ]
        ];

        foreach ($usuarios as $usuario) {
            Usuarios::create($usuario);
        }
    }
}