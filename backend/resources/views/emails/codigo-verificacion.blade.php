<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <div class='email-container'>
        <div class='email-body'>
            <p><strong>Estimado(a) {{ $nombreCompleto }}:</strong></p>
            
            <p>Hemos recibido una solicitud de acceso a su cuenta en el sistema de CIACBLP</p>
            
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