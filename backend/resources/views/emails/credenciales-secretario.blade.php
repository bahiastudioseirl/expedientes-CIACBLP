<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    <h2>Credenciales de Acceso - Expediente {{ $codigoExpediente }}</h2>

    <p>Estimado/a {{ $nombreCompleto }},</p>

    <p>Ha sido asignado/a como secretario/a del expediente <strong>{{ $codigoExpediente }}</strong>.</p>

    <h3>Sus credenciales de acceso:</h3>
    <p>
        <strong>Correo:</strong> {{ $correo }}<br>
        <strong>Contraseña:</strong> {{ $contrasena }}
    </p>

    <p><strong>Como secretario/a, tendrá acceso a las funciones administrativas del expediente y será responsable de gestionar el flujo del procedimiento arbitral.</strong></p>


    <hr>
    <div class='email-footer'>
        <p>Este es un correo automático, por favor no responder directamente.</p>
        <p>Centro de Arbitraje CIACBLP</p>
    </div>
</body>

</html>