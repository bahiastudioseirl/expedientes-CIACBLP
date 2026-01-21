<?php

namespace Database\Seeders;

use App\Models\Roles;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['nombre' => 'Administrador'],
            ['nombre' => 'Arbitro'],
            ['nombre' => 'Secretario'],
            ['nombre' => 'Demandante'],
            ['nombre' => 'Demandado'],
            ['nombre' => 'Contador'],
        ];

        foreach ($roles as $rol) {
            Roles::create($rol);
        }
    }
}