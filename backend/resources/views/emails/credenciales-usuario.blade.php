<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credenciales de Acceso</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    <h2>Credenciales de Acceso al Sistema</h2>

    <p>Estimado/a {{ $nombre_completo }},</p>

    <p>Se ha creado exitosamente su cuenta de usuario en nuestro sistema.</p>

    <h3>Sus credenciales de acceso:</h3>
    <p>
        <strong>Correo:</strong> {{ $correo }}<br>
        <strong>Contraseña:</strong> {{ $contrasena }}
    </p>

    <hr>
    <div class='email-footer'>
        <p>Este es un correo automático, por favor no responder directamente.</p>
        <p>Centro de Arbitraje CIACBLP</p>
    </div>
</body>
</html>