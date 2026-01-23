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
                'nombre_completo' => 'Admin CIACBLP',
                'numero_documento' => '12345678',
                'correo' => 'adminexpedientes@ciacblp.com',
                'contrasena' => '4dminC!@#2026',
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