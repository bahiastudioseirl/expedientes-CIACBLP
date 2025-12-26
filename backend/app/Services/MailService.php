<?php

namespace App\Services;

use App\Mail\CredencialesExpediente;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MailService
{
    public function enviarCredencialesExpediente(Usuarios $usuario, string $asuntoExpediente): bool
    {
        try {
            $correos = $usuario->correos->pluck('direccion')->toArray();
            
            if (empty($correos)) {
                return false;
            }

            $mail = new CredencialesExpediente(
                nombres: $usuario->nombre,
                apellidos: $usuario->apellido,
                numeroDocumento: $usuario->numero_documento,
                contrasena: $this->obtenerContrasenaTextoPlano($usuario),
                asuntoExpediente: $asuntoExpediente
            );

            foreach ($correos as $correo) {
                Mail::to($correo)->send($mail);
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Error enviando correo de credenciales', [
                'usuario_id' => $usuario->id_usuario,
                'error' => $e->getMessage()
            ]);
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
        return Str::upper(Str::random(4));
    }
}