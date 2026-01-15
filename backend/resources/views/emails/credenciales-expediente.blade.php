<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial Narrow', Arial, sans-serif; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .email-container { background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .email-header { background-color: #ffffff; text-align: center; padding: 30px 20px; border-bottom: 2px solid #e9ecef; }
        .email-body { padding: 30px; line-height: 1.6; }
        .email-footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; }
        .credentials-box { background-color: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
        .warning-text { color: #dc3545; font-weight: bold; }
        .mensaje-box { background-color: #e9f4ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; }
        p { margin-bottom: 15px; }
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
            <p><strong>Estimado(a) participante:</strong></p>
            
            @if(!empty($mensaje))
            <div class="mensaje-box">
                <p><strong>Mensaje del Secretario:</strong></p>
                <p>{{ $mensaje }}</p>
            </div>
            @endif
            
            <div class="credentials-box">
                <h3 style="margin-top: 0; color: #007bff;">Sus credenciales de acceso:</h3>
                <p><strong>Correo:</strong> {{ $correo }}</p>
                <p><strong>Contraseña:</strong> <span class='warning-text'>{{ $contrasena }}</span></p>
            </div>
            
            <p>Atentamente,</p>
            <p><strong>CIACBLP</strong></p>
        </div>
        <div class='email-footer'>
            <p>Este es un correo automático, por favor no responder directamente.</p>
            <p>Centro de Arbitraje CIACBLP</p>
        </div>
    </div>
</body>
</html>