<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solicitudes_demandados_extras', function (Blueprint $table) {
            $table->id('id_solicitud_demandado_extra');
            $table->boolean('mesa_partes_virtual');
            $table->string('direccion_fiscal')->nullable();
            $table->unsignedBigInteger('id_solicitud_parte');

            $table->foreign('id_solicitud_parte')->references('id_solicitud_parte')->on('solicitudes_partes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_demandado_extra');
    }
};
