<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CredencialesUsuario extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nombreCompleto,
        public string $correo,
        public string $contrasena
    ) {}

    public function build()
    {
        return $this->view('emails.credenciales-usuario')
                    ->subject('Credenciales de acceso al sistema')
                    ->with([
                        'nombre_completo' => $this->nombreCompleto,
                        'correo' => $this->correo,
                        'contrasena' => $this->contrasena,
                    ]);
    }
}