<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlantillaArbitrajeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear la plantilla principal
        $plantillaId = DB::table('plantillas')->insertGetId([
            'nombre' => 'Plantilla de Arbitraje Estándar',
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Etapa 1: Presentación de solicitud arbitral
        $etapa1Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Presentación de solicitud arbitral',
            'id_plantilla' => $plantillaId,
            'orden' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'orden' => 1,
                'dias_habiles' => 10,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'orden' => 2,
                'dias_habiles' => 5,
                'es_habil' => true,
                'es_obligatorio' => false,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 3',
                'orden' => 3,
                'dias_habiles' => 10,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 4',
                'orden' => 4,
                'dias_habiles' => 10,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 5',
                'orden' => 5,
                'dias_habiles' => 10,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // Etapa 2: Designación de árbitro único
        $etapa2Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Designación de árbitro único',
            'id_plantilla' => $plantillaId,
            'orden' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'orden' => 1,
                'dias_habiles' => 5,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa2Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'orden' => 2,
                'dias_habiles' => 5,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa2Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 3',
                'orden' => 3,
                'dias_habiles' => 5,
                'es_habil' => true,
                'es_obligatorio' => false,
                'id_etapa' => $etapa2Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 4',
                'orden' => 4,
                'dias_habiles' => 0,
                'es_habil' => false,
                'es_obligatorio' => false,
                'id_etapa' => $etapa2Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Etapa 3: Etapa 3
        $etapa3Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Etapa 3',
            'id_plantilla' => $plantillaId,
            'orden' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'orden' => 1,
                'dias_habiles' => 5,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa3Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'orden' => 2,
                'dias_habiles' => 3,
                'es_habil' => true,
                'es_obligatorio' => false,
                'id_etapa' => $etapa3Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 3',
                'orden' => 3,
                'dias_habiles' => 30,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa3Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 4',
                'orden' => 4,
                'dias_habiles' => 15,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa3Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Etapa 4: Fijación de puntos controvertidos y audiencia
        $etapa4Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Fijación de puntos controvertidos y audiencia',
            'id_plantilla' => $plantillaId,
            'orden' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'orden' => 1,
                'dias_habiles' => 0,
                'es_habil' => false,
                'es_obligatorio' => true,
                'id_etapa' => $etapa4Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'orden' => 2,
                'dias_habiles' => 10,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa4Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Etapa 5: Emisión de Laudo
        $etapa5Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Emisión de Laudo',
            'id_plantilla' => $plantillaId,
            'orden' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'orden' => 1,
                'dias_habiles' => 30,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'orden' => 2,
                'dias_habiles' => 10,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 3',
                'orden' => 3,
                'dias_habiles' => 10,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 4',
                'orden' => 4,
                'dias_habiles' => 10,
                'es_habil' => true,
                'es_obligatorio' => true,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 5 - Cierre del proceso',
                'orden' => 5,
                'dias_habiles' => 0,
                'es_habil' => false,
                'es_obligatorio' => true,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->command->info('Plantilla de Arbitraje creada exitosamente con 5 etapas y sus sub-etapas.');
    }
}
