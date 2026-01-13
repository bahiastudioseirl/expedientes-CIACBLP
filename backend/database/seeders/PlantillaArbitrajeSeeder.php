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
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'tiene_tiempo' => true,
                'duracion_dias' => 10,
                'es_opcional' => false,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'tiene_tiempo' => true,
                'duracion_dias' => 5,
                'es_opcional' => true,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 3',
                'tiene_tiempo' => true,
                'duracion_dias' => 10,
                'es_opcional' => false,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 4',
                'tiene_tiempo' => true,
                'duracion_dias' => 10,
                'es_opcional' => false,
                'id_etapa' => $etapa1Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Etapa 2: Designación de árbitro único
        $etapa2Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Designación de árbitro único',
            'id_plantilla' => $plantillaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'tiene_tiempo' => true,
                'duracion_dias' => 5,
                'es_opcional' => false,
                'id_etapa' => $etapa2Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'tiene_tiempo' => true,
                'duracion_dias' => 5,
                'es_opcional' => false,
                'id_etapa' => $etapa2Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 3',
                'tiene_tiempo' => true,
                'duracion_dias' => 5,
                'es_opcional' => true,
                'id_etapa' => $etapa2Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 4',
                'tiene_tiempo' => false,
                'duracion_dias' => null,
                'es_opcional' => true,
                'id_etapa' => $etapa2Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Etapa 3: Etapa 3
        $etapa3Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Etapa 3',
            'id_plantilla' => $plantillaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'tiene_tiempo' => true,
                'duracion_dias' => 5,
                'es_opcional' => false,
                'id_etapa' => $etapa3Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'tiene_tiempo' => true,
                'duracion_dias' => 3,
                'es_opcional' => true,
                'id_etapa' => $etapa3Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 3',
                'tiene_tiempo' => true,
                'duracion_dias' => 30,
                'es_opcional' => false,
                'id_etapa' => $etapa3Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 4',
                'tiene_tiempo' => true,
                'duracion_dias' => 15,
                'es_opcional' => false,
                'id_etapa' => $etapa3Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Etapa 4: Fijación de puntos controvertidos y audiencia
        $etapa4Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Fijación de puntos controvertidos y audiencia',
            'id_plantilla' => $plantillaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'tiene_tiempo' => false,
                'duracion_dias' => null,
                'es_opcional' => false,
                'id_etapa' => $etapa4Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'tiene_tiempo' => true,
                'duracion_dias' => 10,
                'es_opcional' => false,
                'id_etapa' => $etapa4Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Etapa 5: Emisión de Laudo
        $etapa5Id = DB::table('etapas')->insertGetId([
            'nombre' => 'Emisión de Laudo',
            'id_plantilla' => $plantillaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sub_etapas')->insert([
            [
                'nombre' => 'Sub etapa 1',
                'tiene_tiempo' => true,
                'duracion_dias' => 30,
                'es_opcional' => false,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 2',
                'tiene_tiempo' => true,
                'duracion_dias' => 10,
                'es_opcional' => false,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 3',
                'tiene_tiempo' => true,
                'duracion_dias' => 10,
                'es_opcional' => false,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 4',
                'tiene_tiempo' => true,
                'duracion_dias' => 10,
                'es_opcional' => false,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Sub etapa 5 - Cierre del proceso',
                'tiene_tiempo' => false,
                'duracion_dias' => null,
                'es_opcional' => false,
                'id_etapa' => $etapa5Id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->command->info('Plantilla de Arbitraje creada exitosamente con 5 etapas y sus sub-etapas.');
    }
}
