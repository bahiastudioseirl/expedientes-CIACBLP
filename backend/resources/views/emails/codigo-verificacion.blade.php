<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial Narrow', Arial, sans-serif; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .email-container { background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .email-header { background-color: #ffffff; text-align: center; padding: 30px 20px; border-bottom: 2px solid #e9ecef; }
        .email-body { padding: 30px; line-height: 1.6; }
        .email-footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; }
        .code-box { background-color: #f8f9fa; border: 2px solid #28a745; border-radius: 8px; padding: 30px; margin: 20px 0; text-align: center; }
        .code-text { font-size: 32px; font-weight: bold; color: #28a745; letter-spacing: 8px; margin: 10px 0; }
        .warning-text { color: #dc3545; font-weight: bold; }
        .highlight { background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }
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
            <p><strong>Estimado(a) {{ $nombreCompleto }}:</strong></p>
            
            <p>Hemos recibido una solicitud de acceso a su cuenta en el sistema del Centro de Arbitraje de la Cámara de Comercio e Industria Boliviano-Alemana La Paz.</p>
            
            <p>Para completar el proceso de verificación, utilice el siguiente código:</p>
            
            <div class="code-box">
                <h3 style="margin-top: 0; color: #28a745;">Su código de verificación:</h3>
                <div class="code-text">{{ $codigo }}</div>
            </div>
            
            <div class="highlight">
                <p><strong>Importante:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Este código es válido únicamente por <span class="warning-text">15 minutos</span></li>
                    <li>No comparta este código con nadie</li>
                    <li>Si usted no solicitó este código, ignore este mensaje</li>
                </ul>
            </div>
            
            <p>Ingrese este código en la pantalla de verificación para acceder a su cuenta.</p>
            
            <p>Si tiene alguna consulta o dificultad, no dude en comunicarse con nosotros.</p>
            
            <p>Atentamente,<br>
            <strong>Centro de Arbitraje CIACBLP</strong><br>
        </div>
        <div class='email-footer'>
            <p>&copy; {{ date('Y') }} Centro de Arbitraje CIACBLP. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no responda a esta dirección.</p>
        </div>
    </div>
</body>
</html>