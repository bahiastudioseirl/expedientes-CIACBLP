import type { CaminoExpedienteData, FlujoConMensajes } from '../schemas/CaminoExpedienteSchema';

// Funciones auxiliares para formateo
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Sin fecha';
  try {
    const fecha = new Date(dateString + 'T00:00:00');
    return fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

const formatDateTime = (dateTimeString: string | null) => {
  if (!dateTimeString) return 'Sin fecha';
  try {
    const fecha = new Date(dateTimeString);
    if (isNaN(fecha.getTime())) {
      return 'Fecha inválida';
    }
    return fecha.toLocaleString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

const formatearEstadoEtapa = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'en_proceso': return 'En proceso';
    case 'completado': return 'Completado';
    case 'pendiente': return 'Pendiente';
    case 'iniciado': return 'Iniciado';
    case 'finalizado': return 'Finalizado';
    default: return estado.charAt(0).toUpperCase() + estado.slice(1).replace(/_/g, ' ');
  }
};

const agruparFlujosPorEtapa = (flujos: FlujoConMensajes[]) => {
  const grupos: { [key: string]: FlujoConMensajes[] } = {};
  
  flujos.forEach(flujo => {
    const nombreEtapa = flujo.etapa?.nombre || 'Sin etapa';
    if (!grupos[nombreEtapa]) {
      grupos[nombreEtapa] = [];
    }
    grupos[nombreEtapa].push(flujo);
  });
  
  return grupos;
};

const calcularEstadoPlazo = (fechaInicio: string | null, fechaLimite: string | null, fechaFin: string | null): string => {
  if (!fechaInicio || !fechaLimite) return 'Sin datos';
  
  const ahora = new Date();
  const inicio = new Date(fechaInicio + 'T00:00:00');
  const limite = new Date(fechaLimite + 'T23:59:59');
  const fin = fechaFin ? new Date(fechaFin + 'T00:00:00') : null;
  
  if (fin) {
    if (fin > limite) {
      return 'Vencido';
    }
    return 'A tiempo';
  }
  
  if (ahora > limite) {
    return 'Vencido';
  }
  
  const diasParaVencer = Math.ceil((limite.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diasParaVencer <= 3 && diasParaVencer > 0) {
    return 'Por vencer';
  }
  
  if (ahora >= inicio && ahora <= limite) {
    return 'A tiempo';
  }
  
  return 'A tiempo';
};

const getEstadoEmoji = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'completado': 
    case 'a tiempo': return '✅';
    case 'vencido': return '❌';
    case 'por vencer': return '⚠️';
    default: return '🕐';
  }
};

export const generarHtmlCamino = (camino: CaminoExpedienteData, codigoExpediente: string): string => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Camino del Expediente - ${codigoExpediente}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8fafc;
            color: #334155;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(15, 23, 42, 0.25);
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #4338ca 100%);
            color: white;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .header p {
            opacity: 0.8;
            font-size: 16px;
        }
        .content {
            padding: 24px;
        }
        .section {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
        }
        .section-title::before {
            content: "📋";
            margin-right: 8px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
        }
        .participant-card, .user-card {
            background: #f8fafc;
            border-radius: 8px;
            padding: 16px;
        }
        .user-card {
            background: #eef2ff;
        }
        .card-header {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .card-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 12px;
        }
        .card-info {
            font-size: 14px;
            color: #475569;
            line-height: 1.5;
        }
        .timeline {
            position: relative;
            padding-left: 40px;
        }
        .timeline::before {
            content: '';
            position: absolute;
            left: 16px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e2e8f0;
        }
        .etapa {
            position: relative;
            margin-bottom: 32px;
        }
        .etapa-node {
            position: absolute;
            left: -32px;
            top: 16px;
            width: 16px;
            height: 16px;
            background: white;
            border: 2px solid #7c3aed;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .etapa-node::after {
            content: '';
            width: 8px;
            height: 8px;
            background: #7c3aed;
            border-radius: 50%;
        }
        .etapa-header {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .etapa-title {
            font-size: 18px;
            font-weight: 600;
        }
        .etapa-info {
            font-size: 14px;
            opacity: 0.9;
        }
        .subetapas {
            padding-left: 24px;
        }
        .subetapa {
            position: relative;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .subetapa-node {
            position: absolute;
            left: -24px;
            top: 16px;
            width: 12px;
            height: 12px;
            background: white;
            border: 2px solid #3b82f6;
            border-radius: 50%;
        }
        .subetapa-node::after {
            content: '';
            width: 6px;
            height: 6px;
            background: #3b82f6;
            border-radius: 50%;
            position: absolute;
            top: 1px;
            left: 1px;
        }
        .subetapa-header {
            background: #f8fafc;
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
        }
        .subetapa-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
        }
        .info-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
            text-align: center;
        }
        .info-item {
            text-align: center;
        }
        .info-label {
            font-size: 10px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 14px;
            color: #475569;
        }
        .estado-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 500;
        }
        .estado-a-tiempo {
            background: #dcfce7;
            color: #166534;
        }
        .estado-vencido {
            background: #fecaca;
            color: #991b1b;
        }
        .estado-por-vencer {
            background: #fef3c7;
            color: #92400e;
        }
        .mensajes {
            padding: 16px;
        }
        .mensaje {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
        }
        .mensaje-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .mensaje-usuario {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .rol-badge {
            background: #f1f5f9;
            color: #64748b;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        .mensaje-fecha {
            font-size: 12px;
            color: #94a3b8;
        }
        .mensaje-contenido {
            font-size: 14px;
            color: #334155;
            margin-bottom: 8px;
        }
        .adjuntos {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .adjunto {
            background: #dbeafe;
            color: #1d4ed8;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            text-decoration: none;
        }
        .adjunto:hover {
            background: #bfdbfe;
        }
        @media print {
            body { margin: 0; }
            .container { box-shadow: none; margin: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Camino del Expediente</h1>
            <p>${codigoExpediente}</p>
        </div>
        
        <div class="content">
            <!-- Información del Expediente -->
            <div class="section">
                <h3 class="section-title">Información del Expediente</h3>
                
                <div class="info-grid">
                    <!-- Partes -->
                    <div>
                        <h4 style="font-weight: 500; color: #374151; margin-bottom: 12px;">Partes del Proceso</h4>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${camino.expediente.demandante?.map(p => `
                                <div class="participant-card">
                                    <div class="card-header">🏢 DEMANDANTE</div>
                                    <div class="card-title">${p.nombre_razon}</div>
                                </div>
                            `).join('') || ''}
                            ${camino.expediente.demandado?.map(p => `
                                <div class="participant-card">
                                    <div class="card-header">🏢 DEMANDADO</div>
                                    <div class="card-title">${p.nombre_razon}</div>
                                </div>
                            `).join('') || ''}
                        </div>
                    </div>

                    <!-- Funcionarios -->
                    <div>
                        <h4 style="font-weight: 500; color: #374151; margin-bottom: 12px;">Funcionarios Asignados</h4>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${camino.expediente.arbitro ? `
                                <div class="user-card">
                                    <div class="card-header">👨‍⚖️ ÁRBITRO</div>
                                    <div class="card-title">${camino.expediente.arbitro.nombre_completo}</div>
                                </div>
                            ` : ''}
                            ${camino.expediente.secretario ? `
                                <div class="user-card">
                                    <div class="card-header">📝 SECRETARIO</div>
                                    <div class="card-title">${camino.expediente.secretario.nombre_completo}</div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Timeline de Flujos -->
            <div class="section">
                <h3 class="section-title">Camino del Expediente</h3>
                
                <div class="timeline">
                    ${Object.entries(agruparFlujosPorEtapa(camino.flujos)).map(([nombreEtapa, flujosDeLaEtapa], etapaIndex) => `
                        <div class="etapa">
                            <div class="etapa-node"></div>
                            
                            <!-- Header de la Etapa -->
                            <div class="etapa-header">
                                <div>
                                    <div class="etapa-title">ETAPA: ${nombreEtapa}</div>
                                </div>
                                <div class="etapa-info">
                                    ${flujosDeLaEtapa.length} subetapa${flujosDeLaEtapa.length > 1 ? 's' : ''}
                                </div>
                            </div>

                            <!-- Subetapas -->
                            <div class="subetapas">
                                ${flujosDeLaEtapa.map((flujo, subetapaIndex) => `
                                    <div class="subetapa">
                                        <div class="subetapa-node"></div>
                                        
                                        <!-- Subetapa Header -->
                                        <div class="subetapa-header">
                                            <div class="subetapa-title">
                                                Subetapa: ${flujo.subetapa?.nombre || 'Sin subetapa'}
                                            </div>
                                            
                                            <!-- Grid de Información -->
                                            <div class="info-row">
                                                <div class="info-item">
                                                    <div class="info-label">Fecha Inicio</div>
                                                    <div class="info-value">${formatDate(flujo.fecha_inicio)}</div>
                                                </div>
                                                <div class="info-item">
                                                    <div class="info-label">Fecha Límite</div>
                                                    <div class="info-value">${formatDate(flujo.fecha_limite)}</div>
                                                </div>
                                                <div class="info-item">
                                                    <div class="info-label">Estado Plazo</div>
                                                    <div class="info-value">
                                                        <span class="estado-badge estado-${calcularEstadoPlazo(flujo.fecha_inicio, flujo.fecha_limite, flujo.fecha_fin).toLowerCase().replace(' ', '-')}">
                                                            ${getEstadoEmoji(calcularEstadoPlazo(flujo.fecha_inicio, flujo.fecha_limite, flujo.fecha_fin))} ${calcularEstadoPlazo(flujo.fecha_inicio, flujo.fecha_limite, flujo.fecha_fin)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="info-item">
                                                    <div class="info-label">Estado Etapa</div>
                                                    <div class="info-value">${formatearEstadoEtapa(flujo.estado)}</div>
                                                </div>
                                                <div class="info-item">
                                                    <div class="info-label">Fecha Fin</div>
                                                    <div class="info-value">${formatDate(flujo.fecha_fin)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Mensajes -->
                                        ${flujo.mensajes && flujo.mensajes.length > 0 ? `
                                            <div class="mensajes">
                                                ${flujo.mensajes.map((mensaje) => `
                                                    <div class="mensaje">
                                                        <div class="mensaje-header">
                                                            <div class="mensaje-usuario">
                                                                <span class="rol-badge">${mensaje.usuario.rol}</span>
                                                                <span style="font-weight: 500; color: #1e293b;">${mensaje.usuario.nombre_completo}</span>
                                                            </div>
                                                            <span class="mensaje-fecha">${formatDateTime(mensaje.fecha_envio)}</span>
                                                        </div>
                                                        
                                                        <div class="mensaje-contenido">${mensaje.contenido}</div>

                                                        ${mensaje.adjuntos && mensaje.adjuntos.length > 0 ? `
                                                            <div class="adjuntos">
                                                                ${mensaje.adjuntos.map((adjunto) => `
                                                                    <a href="${adjunto.url_descarga}" target="_blank" class="adjunto">
                                                                        📎 ${adjunto.nombre_archivo}
                                                                    </a>
                                                                `).join('')}
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>

    <script>
        // Abrir automáticamente el diálogo de impresión
        window.onload = function() {
            setTimeout(() => {
                window.print();
            }, 1000);
        };
    </script>
</body>
</html>`;
};

export const descargarHtmlCamino = (camino: CaminoExpedienteData, codigoExpediente: string) => {
  const html = generarHtmlCamino(camino, codigoExpediente);
  
  // Crear y descargar el archivo HTML
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Camino_Expediente_${codigoExpediente}_${new Date().toISOString().split('T')[0]}.html`;
  link.click();
  URL.revokeObjectURL(url);
};