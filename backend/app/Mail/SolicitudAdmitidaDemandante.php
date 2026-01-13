<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SolicitudAdmitidaDemandante extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $codigoExpediente,
        public readonly array $credenciales,
        public readonly array $secretario
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Solicitud Admitida - Expediente ' . $this->codigoExpediente,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.solicitud-admitida-demandante',
            with: [
                'codigoExpediente' => $this->codigoExpediente,
                'correo' => $this->credenciales['correo'],
                'contrasena' => $this->credenciales['contrasena'],
                'nombreSecretario' => $this->secretario['nombre_completo'],
                'correoSecretario' => $this->secretario['correo'],
                'telefonoSecretario' => $this->secretario['telefono'] ?? 'No proporcionado',
            ],
        );
    }
}