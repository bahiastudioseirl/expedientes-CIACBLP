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
        Schema::create('expediente_participantes', function (Blueprint $table) {
            $table->id('id_expediente_participante');
            $table->unsignedBigInteger('id_expediente');
            $table->unsignedBigInteger('id_usuario');
            $table->string('rol_en_expediente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expediente_participantes');
    }
};
