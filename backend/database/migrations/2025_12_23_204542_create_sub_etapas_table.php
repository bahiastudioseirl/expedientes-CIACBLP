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
        Schema::create('sub_etapas', function (Blueprint $table) {
            $table->id('id_sub_etapa');
            $table->unsignedBigInteger('id_etapa');
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->integer('orden');
            $table->integer('dias_habiles')->default(0);
            $table->boolean('es_habil')->default(true);
            $table->boolean('es_obligatorio')->default(true);

            $table->foreign('id_etapa')->references('id_etapa')->on('etapas')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_etapas');
    }
};
