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
        Schema::create('expedientes', function (Blueprint $table) {
            $table->id('id_expediente');
            $table->string('codigo_expediente')->unique();
            $table->string('asunto');
            $table->unsignedBigInteger('id_plantilla');
            $table->unsignedBigInteger('id_usuario');
            $table->boolean('activo')->default(true);

            $table->foreign('id_plantilla')->references('id_plantilla')->on('plantillas')->onDelete('cascade');
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expedientes');
    }
};
