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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id("id_usuario");
            $table->string("nombre", 100);
            $table->string("apellido", 100);
            $table->string("numero_documento", 50)->unique();
            $table->string("contrasena");
            $table->string("telefono", 20)->nullable();
            $table->boolean("activo")->default(true);
            $table->unsignedBigInteger("id_rol");

            $table->foreign("id_rol")->references("id_rol")->on("roles")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
