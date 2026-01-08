<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CodigoVerificacion extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $nombreCompleto,
        public readonly string $codigo,
        public readonly string $fechaExpiracion
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Código de Verificación - CIACBLP',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.codigo-verificacion',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}