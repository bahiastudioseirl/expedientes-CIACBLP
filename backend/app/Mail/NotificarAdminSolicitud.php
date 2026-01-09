<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificarAdminSolicitud extends Mailable
{
    use SerializesModels;

    public function build()
    {
        return $this->subject('NUEVA SOLICITUD INGRESADA AL SISTEMA')
            ->view('emails.notificar-admin-solicitud');
    }
}
