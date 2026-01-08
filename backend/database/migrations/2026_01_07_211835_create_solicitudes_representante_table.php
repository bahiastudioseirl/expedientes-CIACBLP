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
        Schema::create('solicitudes_representantes', function (Blueprint $table) {
            $table->id('id_solicitud_representante');
            $table->string('nombre_completo');
            $table->string('numero_documento');
            $table->string('telefono')->nullable();
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
        Schema::dropIfExists('solicitudes_representante');
    }
};
