<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial Narrow', Arial, sans-serif; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .email-container { background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .email-header { background-color: #ffffff; text-align: center; padding: 30px 20px; border-bottom: 2px solid #e9ecef; }
        .email-body { padding: 30px; line-height: 1.6; }
        .email-footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; }
        .mensaje-box { background-color: #f8f9fa; border-left: 4px solid #007bff; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .info-box { background-color: #e9f4ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        p { margin-bottom: 15px; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='email-header'>
            @if(app()->environment('local'))
                <img src="data:image/webp;base64,{{ base64_encode(file_get_contents(public_path('images/logo-ciacblp.webp'))) }}" width="200" alt="CIACBLP" style="max-width: 200px; height: auto;">
            @else
                <img src="{{ url('images/logo-ciacblp.webp') }}" width="200" alt="CIACBLP" style="max-width: 200px; height: auto;">
            @endif
            <p style="margin: 10px 0 0 0; color: #6c757d;">Centro de Arbitraje</p>
        </div>
        <div class='email-body'>
            <p><strong>Estimado(a) {{ $nombre_destinatario }}:</strong></p>
            
            <p>Has recibido un nuevo mensaje en el expediente arbitral <strong>{{ $codigo_expediente }}</strong>.</p>
            
            <div class="info-box">
                <p><strong>Asunto:</strong> {{ $asunto_titulo }}</p>
                <p><strong>De:</strong> {{ $nombre_remitente }}</p>
            </div>
            
            <div class="mensaje-box">
                <p><strong>Mensaje:</strong></p>
                <p>{{ $contenido_mensaje }}</p>
            </div>
            
            @if(!empty($adjuntos) && count($adjuntos) > 0)
            <div class="info-box">
                <p><strong>Archivos adjuntos:</strong></p>
                <ul style="margin: 5px 0; padding-left: 20px;">
                    @foreach($adjuntos as $adjunto)
                        <li>{{ $adjunto }}</li>
                    @endforeach
                </ul>
            </div>
            @endif
            
            <p>Por favor ingresa a la plataforma para ver el mensaje completo y responder si es necesario.</p>
            
            <p>Atentamente,</p>
            <p><strong>CIACBLP</strong></p>
        </div>
        <div class='email-footer'>
            <p>Este es un correo automático de notificación. Para responder, ingresa a la plataforma.</p>
            <p>Centro de Arbitraje CIACBLP</p>
        </div>
    </div>
</body>
</html>