<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    <h2>Solicitud Admitida - Expediente {{ $codigoExpediente }}</h2>

    <p>Estimado usuario,</p>

    <p>Su solicitud de arbitraje ha sido admitida y se ha creado el expediente <strong>{{ $codigoExpediente }}</strong>.</p>

    <h3>Sus credenciales de acceso:</h3>
    <p>
        <strong>Correo:</strong> {{ $correo }}<br>
        <strong>Contraseña:</strong> {{ $contrasena }}
    </p>

    <h3>Secretario Asignado:</h3>
    <p>
        <strong>Nombre:</strong> {{ $nombreSecretario }}<br>
        <strong>Correo:</strong> {{ $correoSecretario }}<br>
        <strong>Teléfono:</strong> {{ $telefonoSecretario }}
    </p>


    <hr>
    <div class='email-footer'>
        <p>Este es un correo automático, por favor no responder directamente.</p>
        <p>Centro de Arbitraje CIACBLP</p>
    </div>
</body>

</html>