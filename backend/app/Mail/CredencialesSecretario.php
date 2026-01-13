<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CredencialesSecretario extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $codigoExpediente,
        public readonly array $credenciales
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Credenciales de Acceso - Expediente ' . $this->codigoExpediente,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.credenciales-secretario',
            with: [
                'codigoExpediente' => $this->codigoExpediente,
                'nombreCompleto' => $this->credenciales['nombre_completo'],
                'correo' => $this->credenciales['correo'],
                'contrasena' => $this->credenciales['contrasena'],
            ],
        );
    }
}