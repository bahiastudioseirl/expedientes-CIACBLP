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
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id('id_mensaje');
            $table->text('contenido');
            $table->dateTime('fecha_envio');
            $table->unsignedBigInteger('id_usuario');
            $table->unsignedBigInteger('id_asunto');
            
            // Campo para threading: null = mensaje principal, con valor = mensaje hijo
            $table->unsignedBigInteger('mensaje_padre_id')->nullable();
            
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->onDelete('cascade');
            $table->foreign('id_asunto')->references('id_asunto')->on('asuntos')->onDelete('cascade');
            $table->foreign('mensaje_padre_id')->references('id_mensaje')->on('mensajes')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes');
    }
};
