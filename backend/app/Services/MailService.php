<?php

namespace App\Services;

use App\Mail\CredencialesExpediente;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MailService
{
    public function enviarCredencialesExpediente(Usuarios $usuario, string $codigoExpediente): bool
    {
        try {
            $contrasenaPlano = $this->obtenerContrasenaTextoPlano($usuario);

            Mail::to($usuario->correo)->send(new CredencialesExpediente(
                nombres_completos: $usuario->nombre_completo,
                correo: $usuario->correo,
                contrasena: $contrasenaPlano,
                codigo_expediente: $codigoExpediente
            ));

            return true;
        } catch (\Exception $e) {
            Log::error("Error al enviar correo a {$usuario->correo}: " . $e->getMessage());
            return false;
        }
    }

    public function enviarCredencialesMultiplesUsuarios(array $usuarios, string $asuntoExpediente): array
    {
        $resultados = [];
        
        foreach ($usuarios as $usuario) {
            $resultados[$usuario->id_usuario] = $this->enviarCredencialesExpediente($usuario, $asuntoExpediente);
        }

        return $resultados;
    }

    private function obtenerContrasenaTextoPlano(Usuarios $usuario): string
    {
        return $usuario->contrasena_texto_plano ?? 'Contacte al administrador';
    }

    public function generarContrasenaAleatoria(): string
    {
        return Str::upper(Str::random(8));
    }
}