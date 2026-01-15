<?php

namespace App\Mail;

use App\Models\Usuarios;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificacionMensaje extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly int $idMensaje,
        public readonly Usuarios $usuario
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nuevo mensaje en expediente - CIACBLP',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.notificacion-mensaje',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}