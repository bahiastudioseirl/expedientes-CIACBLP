<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AsignacionSecretarioExistente extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $codigoExpediente,
        public readonly string $nombreUsuario
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Ha sido asignado a un nuevo expediente - ' . $this->codigoExpediente,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.vinculacion_expediente',
            with: [
                'codigoExpediente' => $this->codigoExpediente,
                'nombreUsuario' => $this->nombreUsuario,
                'rolUsuario' => 'Secretario Arbitral',
            ],
        );
    }
}

