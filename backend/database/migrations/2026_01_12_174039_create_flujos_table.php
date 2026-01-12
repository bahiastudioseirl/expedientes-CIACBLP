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
        Schema::create('flujos', function (Blueprint $table) {
            $table->id('id_flujo');
            $table->string('estado', 100);
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->unsignedBigInteger('id_expediente');
            $table->unsignedBigInteger('id_etapa')->nullable();
            $table->unsignedBigInteger('id_subetapa')->nullable();

            $table->foreign('id_expediente')->references('id_expediente')->on('expedientes')->onDelete('cascade');
            $table->foreign('id_etapa')->references('id_etapa')->on('etapas')->onDelete('set null');
            $table->foreign('id_subetapa')->references('id_sub_etapa')->on('sub_etapas')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flujos');
    }
};
