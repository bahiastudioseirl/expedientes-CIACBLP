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
        Schema::create('solicitudes_designaciones', function (Blueprint $table) {
            $table->id('id_solicitud_designacion');
            $table->boolean('arbitro_unico');
            $table->boolean('propone_arbitro')->nullable();
            $table->boolean('encarga_ciacblp')->nullable();
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
        Schema::dropIfExists('solicitudes_designaciones');
    }
};
