<?php

namespace Database\Seeders;

use App\Models\Correos;
use Illuminate\Database\Seeder;

class CorreosSeeder extends Seeder
{
    public function run(): void
    {
        $correos = [
            [
                'direccion' => 'admindev@bahia.pe',
                'id_usuario' => 1
            ]
        ];
        foreach ($correos as $correo) {
            Correos::create($correo);
        }
    }
}