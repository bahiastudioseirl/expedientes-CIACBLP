<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificacionContador extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $codigoExpediente,
        public readonly string $nombreContador
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Expediente ' . $this->codigoExpediente . ' requiere de su atención',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.notificacion_contador',
            with: [
                'codigoExpediente' => $this->codigoExpediente,
                'nombreUsuario' => $this->nombreContador,
            ],
        );
    }
}