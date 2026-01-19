<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CredencialesExpediente extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $correo,
        public readonly string $contrasena,
        public readonly string $codigoExpediente,
        public readonly string $asuntoTitulo,
        public readonly string $mensaje = '',
        public readonly array $adjuntos = []
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
                'asunto_titulo' => $this->asuntoTitulo,
                'tiene_mensaje' => strlen($this->mensaje) > 0,
                'tiene_adjuntos' => count($this->adjuntos) > 0
            ]
        );
    }

    public function attachments(): array
    {
        Log::info("CredencialesExpediente::attachments - Adjuntos a procesar: " . count($this->adjuntos));
        
        $attachments = [];
        
        foreach ($this->adjuntos as $index => $archivo) {
            Log::info("Procesando adjunto {$index}: " . $archivo->getClientOriginalName());
            
            $attachments[] = Attachment::fromPath($archivo->getPathname())
                ->as($archivo->getClientOriginalName());
        }
        
        Log::info("Total adjuntos añadidos: " . count($attachments));
        
        return $attachments;
    }
}