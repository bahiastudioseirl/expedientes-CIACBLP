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
        Schema::create('solicitudes_partes', function (Blueprint $table) {
            $table->id('id_solicitud_parte');
            $table->enum('tipo', ['demandante', 'demandado']);
            $table->string('nombre_razon');
            $table->string('numero_documento');
            $table->string('telefono')->nullable();
            $table->unsignedBigInteger('id_solicitud');

            $table->foreign('id_solicitud')->references('id_solicitud')->on('solicitudes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_partes');
    }
};
