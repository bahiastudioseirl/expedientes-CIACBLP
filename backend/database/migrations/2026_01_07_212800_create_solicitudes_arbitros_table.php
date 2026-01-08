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
        Schema::create('solicitudes_arbitros', function (Blueprint $table) {
            $table->id('id_solicitud_arbitro');
            $table->string('nombre_completo');
            $table->string('correo')->nullable();
            $table->string('telefono')->nullable();
            $table->unsignedBigInteger('id_solicitud_designacion');

            $table->foreign('id_solicitud_designacion')->references('id_solicitud_designacion')->on('solicitudes_designaciones')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_arbitros');
    }
};
