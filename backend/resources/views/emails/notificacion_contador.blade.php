<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expediente requiere atención</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    <h2>Expediente requiere su atención</h2>

    <p>Estimado/a {{ $nombreUsuario }},</p>

    <p>El expediente <strong>{{ $codigoExpediente }}</strong> requiere de su atención.</p>

    <p>Puede acceder al sistema con sus credenciales habituales para revisar los detalles.</p>

    <hr>
    <div class='email-footer'>
        <p>Este es un correo automático, por favor no responder directamente.</p>
        <p>Centro de Arbitraje CIACBLP</p>
    </div>
</body>
</html>