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
  Users
} from 'lucide-react';
import { obtenerCaminoExpediente } from '../services/obtenerCaminoExpediente';
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

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completado': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'vencido': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'por vencer': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completado': return 'bg-green-100 text-green-800 border-green-200';
      case 'vencido': return 'bg-red-100 text-red-800 border-red-200';
      case 'por vencer': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-PE', {
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
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
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
                  {camino.flujos.map((flujo, index) => (
                    <div key={flujo.id_flujo} className="relative">
                      {/* Timeline Node */}
                      <div className="absolute left-6 w-4 h-4 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>

                      {/* Etapa Header */}
                      <div className="ml-16 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold">
                            ETAPA: {flujo.etapa?.nombre || 'Sin etapa'}
                          </h4>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getEstadoColor(flujo.estado_calculado)}`}>
                            {getEstadoIcon(flujo.estado_calculado)}
                            <span className="ml-2">{flujo.estado_calculado}</span>
                          </span>
                        </div>
                      </div>

                      {/* Subetapa y Detalles */}
                      <div className="ml-16 border border-slate-200 rounded-lg overflow-hidden mb-4">
                        {/* Subetapa Header */}
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                            <div>
                              <span className="text-xs font-medium text-slate-700 uppercase block">Subetapa</span>
                              <span className="text-sm font-semibold text-slate-900">
                                {flujo.subetapa?.nombre || 'Sin subetapa'}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-slate-700 uppercase block">Fecha Inicio</span>
                              <span className="text-sm text-slate-600">{formatDate(flujo.fecha_inicio)}</span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-slate-700 uppercase block">Fecha Límite</span>
                              <span className="text-sm text-slate-600">{formatDate(flujo.fecha_limite)}</span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-slate-700 uppercase block">Estado Plazo</span>
                              <span className={`text-sm font-medium px-2 py-1 rounded ${getEstadoColor(flujo.estado_calculado)}`}>
                                {flujo.estado_calculado}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-slate-700 uppercase block">Estado Etapa</span>
                              <span className="text-sm text-slate-600">{flujo.estado}</span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-slate-700 uppercase block">Fecha Fin</span>
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
                                      {formatDate(mensaje.fecha_envio)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}