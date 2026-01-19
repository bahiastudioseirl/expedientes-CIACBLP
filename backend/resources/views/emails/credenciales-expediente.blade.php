<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    <h2>Credenciales de Acceso - Expediente {{ $codigoExpediente }}</h2>

    <p>Estimado(a) participante,</p>

    @if(!empty($mensaje))
    <p><strong>Mensaje del Secretario:</strong></p>
    <p>{{ $mensaje }}</p>
    <br>
    @endif

    <h3>Sus credenciales de acceso:</h3>
    <p>
        <strong>Correo:</strong> {{ $correo }}<br>
        <strong>Contraseña:</strong> {{ $contrasena }}
    </p>

    <p>Atentamente,</p>
    <p><strong>Centro de Arbitraje CIACBLP</strong></p>

    <hr>
    <div class='email-footer'>
        <p>Este es un correo automático, por favor no responder directamente.</p>
        <p>Centro de Arbitraje CIACBLP</p>
    </div>
</body>

</html>