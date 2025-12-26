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
            <p><strong>Estimado(a) {{ $nombres }} {{ $apellidos }}:</strong></p>
            
            <p>Hemos registrado su participación en el expediente arbitral: <strong>{{ $asuntoExpediente }}</strong></p>
            
            <p>Se ha creado una cuenta en nuestro sistema para que pueda acceder a la información y documentos relacionados con el proceso arbitral.</p>
            
            <div class="credentials-box">
                <h3 style="margin-top: 0; color: #007bff;">Sus credenciales de acceso:</h3>
                <p><strong>Usuario:</strong> {{ $numeroDocumento }}</p>
                <p><strong>Contraseña:</strong> <span class='warning-text'>{{ $contrasena }}</span></p>
            </div>
            
            <div class="highlight">
                <p><strong>Importante:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Sus credenciales son personales, únicas, confidenciales e intransferibles</li>
                    <li>Mantenga seguras sus credenciales de acceso</li>
                </ul>
            </div>
            
            <p>Podrá acceder al sistema a través de nuestra plataforma web utilizando las credenciales proporcionadas.</p>
            
            <p>Si tiene alguna consulta o dificultad para acceder, no dude en comunicarse con nosotros.</p>
            
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