<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CredencialesExpediente extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $correo,
        public readonly string $contrasena,
        public readonly string $codigoExpediente,
        public readonly string $asuntoTitulo,
        public readonly string $mensaje = ''
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->asuntoTitulo,
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.credenciales-expediente',
            with: [
                'correo' => $this->correo,
                'contrasena' => $this->contrasena,
                'mensaje' => $this->mensaje,
                'codigoExpediente' => $this->codigoExpediente,
                'asunto_titulo' => $this->asuntoTitulo
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}