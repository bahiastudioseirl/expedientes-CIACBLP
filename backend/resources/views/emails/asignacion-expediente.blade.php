<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asignación a Expediente</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 5px 5px;
        }
        .expediente {
            background-color: #3498db;
            color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }
        .info-box {
            background-color: white;
            padding: 15px;
            border-left: 4px solid #3498db;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #7f8c8d;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Asignación a Expediente</h1>
    </div>
    
    <div class="content">
        <p>Estimado/a <strong>{{ $nombre_completo }}</strong>,</p>
        
        <p>Le informamos que ha sido asignado/a como <strong>{{ $rol }}</strong> al siguiente expediente:</p>
        
        <div class="expediente">
            {{ $codigo_expediente }}
        </div>
        
        <div class="info-box">
            <p><strong>Próximos pasos:</strong></p>
            <ul>
                <li>Ingrese al sistema con sus credenciales existentes</li>
                <li>Acceda a la sección de expedientes</li>
                <li>Podrá visualizar y gestionar este nuevo expediente asignado</li>
            </ul>
        </div>
        
        <p>Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos.</p>
        
        <p>Saludos cordiales,<br>
        <strong>Centro Internacional de Arbitraje y Conciliación CIAC-BLP</strong></p>
    </div>
    
    <div class="footer">
        <p>Este es un correo automático, por favor no responder.</p>
    </div>
</body>
</html>
