import { useState, useEffect } from 'react';
import { 
  X, 
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  User,
  Building,
  Phone,
  Mail,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { obtenerCaminoExpediente } from '../services/obtenerCaminoExpediente';
import { exportarCaminoExpedienteExcel } from '../services/exportarCaminoExpedienteExcel';
import type { CaminoExpedienteData, FlujoConMensajes } from '../schemas/CaminoExpedienteSchema';

interface ModalCaminoExpedienteProps {
  expedienteId: number;
  codigoExpediente: string;
  onClose: () => void;
}

export default function ModalCaminoExpediente({ 
  expedienteId, 
  codigoExpediente, 
  onClose 
}: ModalCaminoExpedienteProps) {
  const [camino, setCamino] = useState<CaminoExpedienteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportingExcel, setExportingExcel] = useState(false);

  useEffect(() => {
    cargarCamino();
  }, [expedienteId]);

  const cargarCamino = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await obtenerCaminoExpediente(expedienteId);
      
      if (response.success && response.data) {
        setCamino(response.data);
      } else {
        setError('No se pudo obtener el camino del expediente');
      }
    } catch (err: any) {
      console.error('Error al cargar camino:', err);
      setError('Error al cargar el camino del expediente: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleExportarExcel = async () => {
    setExportingExcel(true);
    setError('');
    
    try {
      await exportarCaminoExpedienteExcel(expedienteId);
    } catch (err: any) {
      console.error('Error al exportar Excel:', err);
      setError('Error al exportar Excel: ' + (err.message || err));
    } finally {
      setExportingExcel(false);
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completado': 
      case 'a tiempo': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'vencido': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'por vencer': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completado':
      case 'a tiempo': return 'bg-green-100 text-green-800 border-green-200';
      case 'vencido': return 'bg-red-100 text-red-800 border-red-200';
      case 'por vencer': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Función para formatear el estado de la etapa
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

  // Función para agrupar flujos por etapa
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

  // Función para calcular el estado del plazo basado en fechas
  const calcularEstadoPlazo = (fechaInicio: string | null, fechaLimite: string | null, fechaFin: string | null): string => {
    if (!fechaInicio || !fechaLimite) return 'Sin datos';
    
    const ahora = new Date();
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const limite = new Date(fechaLimite + 'T23:59:59'); // Usar fin del día para el límite
    const fin = fechaFin ? new Date(fechaFin + 'T00:00:00') : null;
    
    // Si ya se completó la subetapa (tiene fecha_fin)
    if (fin) {
      // Si la fecha de fin es mayor que el límite → Vencido
      if (fin > limite) {
        return 'Vencido';
      }
      // Si completó dentro del plazo → A tiempo
      return 'A tiempo';
    }
    
    // Si no se ha completado (fecha_fin es null)
    // Si la fecha actual ya pasó el límite → Vencido
    if (ahora > limite) {
      return 'Vencido';
    }
    
    // Calcular si está "Por vencer" (dentro de los últimos 3 días antes del límite)
    const diasParaVencer = Math.ceil((limite.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
    
    // Si faltan 3 días o menos → Por vencer
    if (diasParaVencer <= 3 && diasParaVencer > 0) {
      return 'Por vencer';
    }
    
    // Si está dentro del rango normal → A tiempo
    if (ahora >= inicio && ahora <= limite) {
      return 'A tiempo';
    }
    
    // Por defecto
    return 'A tiempo';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha';
    try {
      // Extraer los componentes de la fecha para evitar problemas de timezone
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
      // Para timestamps completos (con fecha y hora)
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

  const renderParticipante = (participante: any, tipo: string) => (
    <div key={participante.numero_documento} className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center space-x-2 mb-2">
        <Building className="w-4 h-4 text-slate-600" />
        <span className="text-xs font-medium text-slate-700 uppercase">{tipo}</span>
      </div>
      <h4 className="font-semibold text-slate-900">{participante.nombre_razon}</h4>
      <div className="mt-2 space-y-1 text-sm text-slate-600">
        <div className="flex items-center space-x-1">
          <FileText className="w-3 h-3" />
          <span>{participante.numero_documento}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Phone className="w-3 h-3" />
          <span>{participante.telefono}</span>
        </div>
        {participante.correos?.length > 0 && (
          <div className="flex items-center space-x-1">
            <Mail className="w-3 h-3" />
            <span>{participante.correos[0].correo || participante.correos[0]}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsuario = (usuario: any, tipo: string) => {
    if (!usuario) return null;
    
    return (
      <div className="bg-indigo-50 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-700 uppercase">{tipo}</span>
        </div>
        <h4 className="font-semibold text-slate-900">{usuario.nombre_completo}</h4>
        <div className="mt-2 space-y-1 text-sm text-slate-600">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{usuario.rol}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="w-3 h-3" />
            <span>{usuario.correo}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="w-3 h-3" />
            <span>{usuario.telefono}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <span className="ml-3 text-slate-600">Cargando camino del expediente...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!camino) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="p-6">
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-900">No se pudo cargar el camino</p>
              <p className="text-slate-600 mt-2">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Camino del Expediente</h2>
                <p className="text-blue-100">{codigoExpediente}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportarExcel}
                disabled={exportingExcel}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Exportar a Excel"
              >
                {exportingExcel ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Exportando...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="text-sm">Exportar Excel</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Mostrar errores si existen */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Información del Expediente */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Información del Expediente
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Partes */}
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Partes del Proceso</h4>
                  <div className="space-y-3">
                    {camino.expediente.demandante?.map(p => renderParticipante(p, 'Demandante'))}
                    {camino.expediente.demandado?.map(p => renderParticipante(p, 'Demandado'))}
                  </div>
                </div>

                {/* Funcionarios */}
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Funcionarios Asignados</h4>
                  <div className="space-y-3">
                    {renderUsuario(camino.expediente.arbitro, 'Árbitro')}
                    {renderUsuario(camino.expediente.secretario, 'Secretario')}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline de Flujos */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Camino del Expediente
              </h3>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                
                <div className="space-y-8">
                  {Object.entries(agruparFlujosPorEtapa(camino.flujos)).map(([nombreEtapa, flujosDeLaEtapa], etapaIndex) => (
                    <div key={`etapa-${etapaIndex}`} className="relative">
                      {/* Timeline Node para la etapa */}
                      <div className="absolute left-6 w-4 h-4 bg-white border-2 border-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>

                      {/* Header de la Etapa (solo una vez) */}
                      <div className="ml-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold">
                            ETAPA: {nombreEtapa}
                          </h4>
                          <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 text-sm font-medium text-white">
                              {flujosDeLaEtapa.length} subetapa{flujosDeLaEtapa.length > 1 ? 's' : ''}
                            </span>
                            {/* Estado de la etapa basado en el primer flujo */}
                            <span className={`flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getEstadoColor(flujosDeLaEtapa[0].estado_calculado)}`}>
                              {getEstadoIcon(flujosDeLaEtapa[0].estado_calculado)}
                              <span className="ml-1">{formatearEstadoEtapa(flujosDeLaEtapa[0].estado_calculado)}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subetapas de esta etapa */}
                      <div className="ml-20 space-y-4">
                        {flujosDeLaEtapa.map((flujo, subetapaIndex) => (
                          <div key={flujo.id_flujo} className="relative">
                            {/* Mini timeline node para subetapa */}
                            <div className="absolute -left-6 top-4 w-3 h-3 bg-white border-2 border-blue-400 rounded-full">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full absolute top-0.5 left-0.5"></div>
                            </div>

                            {/* Subetapa Card */}
                            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4 bg-white shadow-sm">
                              {/* Subetapa Header */}
                              <div className="bg-slate-50 px-4 py-4 border-b border-slate-200">
                                {/* Solo título de subetapa, sin estado */}
                                <div className="mb-4">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-slate-600">Subetapa:</span>
                                    <h5 className="font-semibold text-slate-900">
                                      {flujo.subetapa?.nombre || 'Sin subetapa'}
                                    </h5>
                                  </div>
                                </div>
                                
                                {/* Grid de Información */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                  <div className="text-center">
                                    <span className="text-xs font-medium text-slate-700 uppercase block mb-1">Fecha Inicio</span>
                                    <span className="text-sm text-slate-600">{formatDate(flujo.fecha_inicio)}</span>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-xs font-medium text-slate-700 uppercase block mb-1">Fecha Límite</span>
                                    <span className="text-sm text-slate-600">{formatDate(flujo.fecha_limite)}</span>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-xs font-medium text-slate-700 uppercase block mb-1">Estado Plazo</span>
                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(calcularEstadoPlazo(flujo.fecha_inicio, flujo.fecha_limite, flujo.fecha_fin))}`}>
                                      {getEstadoIcon(calcularEstadoPlazo(flujo.fecha_inicio, flujo.fecha_limite, flujo.fecha_fin))}
                                      <span className="ml-1">{calcularEstadoPlazo(flujo.fecha_inicio, flujo.fecha_limite, flujo.fecha_fin)}</span>
                                    </span>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-xs font-medium text-slate-700 uppercase block mb-1">Estado Etapa</span>
                                    <span className="text-sm text-slate-600">{formatearEstadoEtapa(flujo.estado)}</span>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-xs font-medium text-slate-700 uppercase block mb-1">Fecha Fin</span>
                                    <span className="text-sm text-slate-600">{formatDate(flujo.fecha_fin)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Mensajes */}
                              {flujo.mensajes && flujo.mensajes.length > 0 && (
                                <div className="p-4">
                                  <div className="space-y-3">
                                    {flujo.mensajes.map((mensaje) => (
                                      <div key={mensaje.id_mensaje} className="border border-slate-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                              {mensaje.usuario.rol}
                                            </span>
                                            <span className="text-sm font-medium text-slate-900">
                                              {mensaje.usuario.nombre_completo}
                                            </span>
                                          </div>
                                          <span className="text-xs text-slate-500">
                                            {formatDateTime(mensaje.fecha_envio)}
                                          </span>
                                        </div>
                                        
                                        <div className="text-sm text-slate-700 mb-2">
                                          {mensaje.contenido}
                                        </div>

                                        {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {mensaje.adjuntos.map((adjunto) => (
                                              <a
                                                key={adjunto.id_adjunto}
                                                href={adjunto.url_descarga}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                                              >
                                                <Download className="w-3 h-3" />
                                                <span>{adjunto.nombre_archivo}</span>
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}