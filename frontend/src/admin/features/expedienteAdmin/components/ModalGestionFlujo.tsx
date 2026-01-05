import { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  FileText,
  Plus
} from 'lucide-react';
import { 
  obtenerFlujoActualExpediente,
  listarFlujosPorExpediente,
  cambiarEtapaSubetapaExpediente,
  actualizarFlujoExpediente,
  obtenerEtapasPlantillaExpediente,
  type FlujoExpediente,
  type CambiarEtapaExpedienteRequest,
  type ActualizarFlujoExpedienteRequest,
  type Etapa,
  type Subetapa
} from '../services/flujoExpedienteService';

interface ModalGestionFlujoProps {
  expedienteId: number;
  codigoExpediente: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ModalGestionFlujo({ 
  expedienteId, 
  codigoExpediente, 
  onClose, 
  onSuccess 
}: ModalGestionFlujoProps) {
  const [flujoActual, setFlujoActual] = useState<FlujoExpediente | null>(null);
  const [flujos, setFlujos] = useState<FlujoExpediente[]>([]);
  const [etapasDisponibles, setEtapasDisponibles] = useState<Etapa[]>([]);
  const [subetapasDisponibles, setSubetapasDisponibles] = useState<Subetapa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [showCambiarEtapa, setShowCambiarEtapa] = useState(false);
  const [showActualizarFlujo, setShowActualizarFlujo] = useState(false);
  const [nuevaEtapa, setNuevaEtapa] = useState('');
  const [nuevaSubetapa, setNuevaSubetapa] = useState('');
  const [asunto, setAsunto] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [expedienteId]);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Cargar flujo actual y flujos del expediente primero
      const [flujoActualResponse, flujosResponse] = await Promise.all([
        obtenerFlujoActualExpediente(expedienteId),
        listarFlujosPorExpediente(expedienteId)
      ]);

      if (flujoActualResponse.success && flujoActualResponse.data?.flujo) {
        setFlujoActual(flujoActualResponse.data.flujo);
      } else {
        setFlujoActual(null);
      }

      if (flujosResponse.success && flujosResponse.data?.flujos) {
        setFlujos(flujosResponse.data.flujos);
      } else {
        setFlujos([]);
      }

      // Cargar etapas de plantilla por separado (no crítico)
      try {
        const etapasResponse = await obtenerEtapasPlantillaExpediente(expedienteId);
        
        if (etapasResponse?.success && etapasResponse.data) {
          setEtapasDisponibles(etapasResponse.data);
        } else {
          setEtapasDisponibles([]);
        }
      } catch (etapasError) {
        setEtapasDisponibles([]);
      }
    } catch (err: any) {
      setError('Error al cargar los datos del flujo: ' + (err.message || err));
      setFlujoActual(null);
      setFlujos([]);
      setEtapasDisponibles([]);
      setSubetapasDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el cambio de etapa y actualizar subetapas
  const handleEtapaChange = (etapaId: string) => {
    setNuevaEtapa(etapaId);
    setNuevaSubetapa(''); // Reset subetapa selection
    
    if (etapaId) {
      const etapaSeleccionada = etapasDisponibles.find(e => e.id_etapa === parseInt(etapaId));
      if (etapaSeleccionada?.subetapas) {
        setSubetapasDisponibles(etapaSeleccionada.subetapas);
      } else {
        setSubetapasDisponibles([]);
      }
    } else {
      setSubetapasDisponibles([]);
    }
  };

  // Función para abrir modal de cambiar etapa
  const abrirModalCambiarEtapa = () => {
    setShowCambiarEtapa(true);
    setNuevaEtapa('');
    setNuevaSubetapa('');
    setAsunto('');
    setSubetapasDisponibles([]);
    setError('');
  };

  // Función para abrir modal de actualizar flujo con datos precargados
  const abrirModalActualizarFlujo = () => {
    if (flujoActual) {
      setShowActualizarFlujo(true);
      setNuevaEtapa(flujoActual.etapa?.id_etapa?.toString() || '');
      setNuevaSubetapa(flujoActual.subetapa?.id_sub_etapa?.toString() || '');
      setAsunto('');
      
      // Cargar subetapas de la etapa actual
      if (flujoActual.etapa?.id_etapa) {
        const etapaActual = etapasDisponibles.find(e => e.id_etapa === flujoActual.etapa!.id_etapa);
        if (etapaActual?.subetapas) {
          setSubetapasDisponibles(etapaActual.subetapas);
        } else {
          setSubetapasDisponibles([]);
        }
      }
      
      setError('');
    }
  };

  const handleCambiarEtapa = async () => {
    if (!nuevaEtapa || !asunto.trim()) {
      setError('Por favor completa la etapa y el asunto');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const data: CambiarEtapaExpedienteRequest = {
        id_expediente: expedienteId,
        id_etapa: parseInt(nuevaEtapa),
        id_subetapa: nuevaSubetapa ? parseInt(nuevaSubetapa) : undefined,
        asunto: asunto.trim()
      };

      const response = await cambiarEtapaSubetapaExpediente(data);

      if (response.success) {
        await cargarDatos();
        setShowCambiarEtapa(false);
        setNuevaEtapa('');
        setNuevaSubetapa('');
        setAsunto('');
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('Error al cambiar etapa:', err);
      setError(err?.response?.data?.message || 'Error al cambiar la etapa');
    } finally {
      setSaving(false);
    }
  };

  const handleActualizarFlujo = async () => {
    if (!flujoActual || !nuevaEtapa || !asunto.trim()) {
      setError('Por favor completa la etapa y el asunto');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const data: ActualizarFlujoExpedienteRequest = {
        id_etapa: parseInt(nuevaEtapa),
        id_subetapa: nuevaSubetapa ? parseInt(nuevaSubetapa) : undefined,
        asunto: asunto.trim()
      };

      const response = await actualizarFlujoExpediente(flujoActual.id_flujo, data);

      if (response.success) {
        await cargarDatos();
        setShowActualizarFlujo(false);
        setNuevaEtapa('');
        setNuevaSubetapa('');
        setAsunto('');
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('Error al actualizar flujo:', err);
      setError(err?.response?.data?.message || 'Error al actualizar el flujo');
    } finally {
      setSaving(false);
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'completado': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'vencido': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'por vencer': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      case 'por vencer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gestión de Flujo</h2>
              <p className="text-sm text-slate-600">Expediente: {codigoExpediente}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Flujo Actual */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Flujo Actual</h3>
              
              {flujoActual ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(flujoActual.estado_calculado || flujoActual.estado)}`}>
                      {flujoActual.estado_calculado || flujoActual.estado}
                    </span>
                    {getEstadoIcon(flujoActual.estado_calculado || flujoActual.estado)}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Etapa:</span>
                      <p className="text-slate-900">{flujoActual.etapa?.nombre || 'Sin etapa'}</p>
                    </div>
                    
                    {flujoActual.subetapa && (
                      <div>
                        <span className="text-sm font-medium text-slate-700">Subetapa:</span>
                        <p className="text-slate-900">{flujoActual.subetapa?.nombre || 'Sin subetapa'}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>Inicio: {flujoActual.fecha_inicio ? formatDate(flujoActual.fecha_inicio) : 'Sin fecha'}</span>
                    </div>
                    
                    {flujoActual.fecha_fin_estimada && (
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>Estimado: {formatDate(flujoActual.fecha_fin_estimada)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No hay flujo actual
                </div>
              )}

              {/* Acciones */}
              <div className="space-y-3">
                <button
                  onClick={abrirModalCambiarEtapa}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={saving}
                >
                  <Plus className="w-4 h-4" />
                  <span>Cambiar Etapa (Nuevo Flujo)</span>
                </button>
                
                {flujoActual && (
                  <button
                    onClick={abrirModalActualizarFlujo}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    disabled={saving}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Actualizar Flujo Actual</span>
                  </button>
                )}
              </div>
            </div>

            {/* Historial de Flujos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Historial de Flujos</h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {flujos.length > 0 ? (
                  flujos.slice().reverse().map((flujo, index) => (
                    <div key={flujo.id_flujo} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(flujo.estado_calculado || flujo.estado)}`}>
                          {flujo.estado_calculado || flujo.estado}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <span>#{flujos.length - index}</span>
                          {getEstadoIcon(flujo.estado_calculado || flujo.estado)}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-slate-900">
                          {flujo.etapa?.nombre || 'Sin etapa'}
                          {flujo.subetapa && ` → ${flujo.subetapa?.nombre || 'Sin subetapa'}`}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-slate-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(flujo.fecha_inicio)}</span>
                          {flujo.fecha_fin && (
                            <>
                              <ArrowRight className="w-3 h-3" />
                              <span>{formatDate(flujo.fecha_fin)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No hay historial de flujos
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modales de formularios */}
        {showCambiarEtapa && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Cambiar Etapa</h3>
                  <button
                    onClick={() => setShowCambiarEtapa(false)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nueva Etapa *
                    </label>
                    <select
                      value={nuevaEtapa}
                      onChange={(e) => handleEtapaChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar etapa</option>
                      {etapasDisponibles.map((etapa) => (
                        <option key={etapa.id_etapa} value={etapa.id_etapa}>
                          {etapa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nueva Subetapa (opcional)
                    </label>
                    <select
                      value={nuevaSubetapa}
                      onChange={(e) => setNuevaSubetapa(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={subetapasDisponibles.length === 0}
                    >
                      <option value="">Seleccionar subetapa</option>
                      {subetapasDisponibles.map((subetapa) => (
                        <option key={subetapa.id_sub_etapa} value={subetapa.id_sub_etapa}>
                          {subetapa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Asunto *
                    </label>
                    <textarea
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe el motivo del cambio..."
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowCambiarEtapa(false)}
                      className="flex-1 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCambiarEtapa}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={saving || !nuevaEtapa || !asunto.trim()}
                    >
                      {saving ? 'Guardando...' : 'Cambiar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showActualizarFlujo && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Actualizar Flujo</h3>
                  <button
                    onClick={() => setShowActualizarFlujo(false)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Etapa *
                    </label>
                    <select
                      value={nuevaEtapa}
                      onChange={(e) => handleEtapaChange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar etapa</option>
                      {etapasDisponibles.map((etapa) => (
                        <option key={etapa.id_etapa} value={etapa.id_etapa}>
                          {etapa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Subetapa (opcional)
                    </label>
                    <select
                      value={nuevaSubetapa}
                      onChange={(e) => setNuevaSubetapa(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={subetapasDisponibles.length === 0}
                    >
                      <option value="">Seleccionar subetapa</option>
                      {subetapasDisponibles.map((subetapa) => (
                        <option key={subetapa.id_sub_etapa} value={subetapa.id_sub_etapa}>
                          {subetapa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Asunto *
                    </label>
                    <textarea
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe la actualización..."
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowActualizarFlujo(false)}
                      className="flex-1 px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleActualizarFlujo}
                      className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                      disabled={saving || !nuevaEtapa || !asunto.trim()}
                    >
                      {saving ? 'Guardando...' : 'Actualizar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}