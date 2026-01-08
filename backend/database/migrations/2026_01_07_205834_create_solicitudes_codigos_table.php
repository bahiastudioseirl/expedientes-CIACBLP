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
        Schema::create('solicitudes_codigos', function (Blueprint $table) {
            $table->id('id_solicitud_codigo');
            $table->string('codigo')->unique();
            $table->dateTime('fecha_expiracion');
            $table->boolean('usado')->default(false);
            $table->unsignedBigInteger('id_usuario_solicitante');

            $table->foreign('id_usuario_solicitante')->references('id_usuario_solicitante')->on('usuarios_solicitantes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_codigos');
    }
};
