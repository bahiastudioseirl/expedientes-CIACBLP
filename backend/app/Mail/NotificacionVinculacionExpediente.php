<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificacionVinculacionExpediente extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nombreUsuario,
        public string $codigoExpediente,
        public string $rolUsuario,
    ) {}

    public function build()
    {
        return $this->subject('Asignación a Expediente - ' . $this->codigoExpediente)
                    ->view('emails.vinculacion_expediente')
                    ->with([
                        'nombreUsuario' => $this->nombreUsuario,
                        'codigoExpediente' => $this->codigoExpediente,
                        'rolUsuario' => $this->rolUsuario,
                    ]);
    }
}