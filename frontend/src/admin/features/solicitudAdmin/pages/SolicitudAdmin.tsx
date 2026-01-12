import { useEffect, useState, useMemo, useCallback } from 'react';
import { CheckCircle, FileText, Search, Eye } from 'lucide-react';
import { obtenerSolicitudes } from '../services/obtenerSolicitudes';
import { admitirSolicitud } from '../services/admitirSolicitud';
import { obtenerSolicitudDetalle } from '../services/obtenerSolicitudDetalle';
import type { Solicitud } from '../schemas/SolicitudSchema';
import ModalDetalleSolicitud from '../components/ModalDetalleSolicitud';

/**
 * Componente principal para la gestión de solicitudes de arbitraje
 */
export default function SolicitudAdmin() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [admitiendoId, setAdmitiendoId] = useState<number | null>(null);
  const [solicitudDetalle, setSolicitudDetalle] = useState<Solicitud | null>(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await obtenerSolicitudes();
      setSolicitudes(response.data.solicitudes);
    } catch (err) {
      setError('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAdmitir = useCallback(async (id: number) => {
    setAdmitiendoId(id);
    setError('');
    try {
      await admitirSolicitud(id);
      await cargarSolicitudes();
    } catch (err) {
      setError('No se pudo admitir la solicitud');
    } finally {
      setAdmitiendoId(null);
    }
  }, [cargarSolicitudes]);

  const handleVerDetalle = useCallback(async (id: number) => {
    try {
      const response = await obtenerSolicitudDetalle(id);
      setSolicitudDetalle(response.data.solicitud);
    } catch (err) {
      setError('No se pudo cargar el detalle de la solicitud');
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSolicitudDetalle(null);
  }, []);

  // Funciones de utilidad simples
  const getDemandante = useCallback((partes: any[]) => {
    const demandante = partes.find(p => p.tipo === 'demandante');
    return demandante?.nombre_razon || 'No especificado';
  }, []);

  const getDemandado = useCallback((partes: any[]) => {
    const demandado = partes.find(p => p.tipo === 'demandado');
    return demandado?.nombre_razon || 'No especificado';
  }, []);

  const formatFecha = useCallback((fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Filtrado memoizado simple
  const filteredSolicitudes = useMemo(() => {
    if (!searchTerm) return solicitudes;
    const searchLower = searchTerm.toLowerCase();
    return solicitudes.filter(s => {
      const demandante = getDemandante(s.partes).toLowerCase();
      const demandado = getDemandado(s.partes).toLowerCase();
      return demandante.includes(searchLower) || demandado.includes(searchLower);
    });
  }, [solicitudes, searchTerm, getDemandante, getDemandado]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-violet-50">
              <FileText className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gestión de Solicitudes</h1>
              <p className="mt-1 text-slate-600">Administra las solicitudes recibidas</p>
            </div>
          </div>
        </div>
        
        {/* Controles de búsqueda */}
        <div className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por demandante o demandado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
              <span className="font-medium text-slate-700">{filteredSolicitudes.length}</span>
              <span className="ml-1 text-slate-500">registros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error simple */}
      {error && (
        <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Contenido principal */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
            <p className="text-sm text-slate-600">Cargando solicitudes...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="border-b bg-slate-50 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Demandante</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Demandado</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Fecha Envío</th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSolicitudes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FileText className="w-12 h-12 mb-3" />
                        <p className="text-sm font-medium">No se encontraron solicitudes</p>
                        <p className="text-xs mt-1">
                          {searchTerm ? "Intenta con otro término de búsqueda" : "No hay solicitudes registradas"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSolicitudes.map(solicitud => (
                    <tr key={solicitud.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">#{solicitud.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{getDemandante(solicitud.partes)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{getDemandado(solicitud.partes)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                          solicitud.estado === 'admitida'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {solicitud.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatFecha(solicitud.created_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleVerDetalle(solicitud.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAdmitir(solicitud.id)}
                            disabled={admitiendoId === solicitud.id || solicitud.estado === 'admitida'}
                            className={`px-3 py-1.5 rounded-lg text-white text-xs transition-colors ${
                              solicitud.estado === 'admitida'
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#132436] hover:bg-[#224666] disabled:opacity-50'
                            }`}
                          >
                            {admitiendoId === solicitud.id ? 'Admitiendo...' : 'Admitir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalle - Mantenemos solo esto separado */}
      <ModalDetalleSolicitud
        solicitud={solicitudDetalle}
        isOpen={!!solicitudDetalle}
        onClose={handleCloseModal}
      />
    </div>
  );
}
