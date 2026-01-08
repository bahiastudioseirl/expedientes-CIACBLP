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
        Schema::create('solicitudes_pretensiones', function (Blueprint $table) {
            $table->id('id_solicitud_pretension');
            $table->text('descripcion');
            $table->boolean('determinada');
            $table->string('cuantia')->nullable();
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
        Schema::dropIfExists('solicitudes_pretensiones');
    }
};
