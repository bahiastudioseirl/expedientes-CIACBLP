<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AsignacionExpediente extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $nombre_completo,
        public readonly string $codigo_expediente,
        public readonly string $rol
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Asignación a Expediente ' . $this->codigo_expediente,
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.asignacion-expediente',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
