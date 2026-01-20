<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asignación a Expediente</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    <h2>Asignación a Expediente</h2>

    <p>Estimado/a {{ $nombreUsuario }},</p>

    <p>Se le ha asignado como <strong>{{ $rolUsuario }}</strong> al siguiente expediente de arbitraje.</p>

    <h3>Información del Expediente:</h3>
    <p>
        <strong>Código del Expediente:</strong> {{ $codigoExpediente }}<br>
        <strong>Su rol:</strong> {{ $rolUsuario }}<br>
        <strong>Fecha de asignación:</strong> {{ date('d/m/Y H:i') }}
    </p>

    <p>Puede acceder al sistema con sus credenciales habituales para revisar los detalles del expediente.</p>

    <hr>
    <div class='email-footer'>
        <p>Este es un correo automático, por favor no responder directamente.</p>
        <p>Centro de Arbitraje CIACBLP</p>
    </div>
</body>
</html>