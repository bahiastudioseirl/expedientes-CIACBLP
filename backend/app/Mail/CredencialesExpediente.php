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
        public readonly string $nombres,
        public readonly string $apellidos,
        public readonly string $numeroDocumento,
        public readonly string $contrasena,
        public readonly string $codigo_expediente
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->codigo_expediente,
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.credenciales-expediente',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}