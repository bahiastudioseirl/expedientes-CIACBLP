<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SolicitudCreada extends Mailable
{
    use SerializesModels;

    public $usuario;

    public function __construct($usuario)
    {
        $this->usuario = $usuario;
    }

    public function build()
    {
        return $this->subject('CONFIRMACION DE SOLICITUD RECIBIDA')
            ->view('emails.solicitud-creada')
            ->with([
                'nombre' => $this->usuario->nombre_completo,
            ]);
    }
}
