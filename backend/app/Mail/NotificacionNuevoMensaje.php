<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class NotificacionNuevoMensaje extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $nombreRemitente,
        public readonly string $contenidoMensaje,
        public readonly string $codigoExpediente,
        public readonly string $asuntoTitulo,
        public readonly array $rutasAdjuntos = [],
        public readonly string $nombreDestinatario = 'Participante'
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
            html: 'emails.notificacion-mensaje',
            with: [
                'nombre_remitente' => $this->nombreRemitente,
                'contenido_mensaje' => $this->contenidoMensaje,
                'codigo_expediente' => $this->codigoExpediente,
                'asunto_titulo' => $this->asuntoTitulo,
                'adjuntos' => array_column($this->rutasAdjuntos, 'nombre'),
                'nombre_destinatario' => $this->nombreDestinatario
            ]
        );
    }

    public function attachments(): array
    {
        $attachments = [];
        
        foreach ($this->rutasAdjuntos as $archivo) {
            if (file_exists($archivo['ruta'])) {
                $attachments[] = Attachment::fromPath($archivo['ruta'])
                    ->as($archivo['nombre']);
            }
        }
        
        return $attachments;
    }
}