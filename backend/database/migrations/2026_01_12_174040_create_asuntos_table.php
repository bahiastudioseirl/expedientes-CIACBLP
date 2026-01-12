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
        Schema::create('asuntos', function (Blueprint $table) {
            $table->id('id_asunto');
            $table->string('titulo');
            $table->boolean('activo')->default(true);
            $table->unsignedBigInteger('id_flujo');
            $table->unsignedBigInteger('id_expediente');
            

            $table->foreign('id_flujo')->references('id_flujo')->on('flujos')->onDelete('cascade');
            $table->foreign('id_expediente')->references('id_expediente')->on('expedientes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asuntos');
    }
};
