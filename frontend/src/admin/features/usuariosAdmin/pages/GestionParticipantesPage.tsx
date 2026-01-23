import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle, 
  Users,
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  obtenerExpedientes, 
  obtenerParticipantesExpediente, 
  cambiarEstadoUsuario,
  agregarParticipanteExpediente
} from '../services/usuariosService';
import type { 
  Expediente, 
  ParticipanteExpediente,
  AgregarParticipanteRequest 
} from '../schemas/UsuarioSchema';
import ModalAgregarParticipante from '../components/ModalAgregarParticipante';

export default function GestionParticipantesPage() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<Expediente | null>(null);
  const [participantes, setParticipantes] = useState<{
    demandantes: ParticipanteExpediente[];
    demandados: ParticipanteExpediente[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingParticipantes, setLoadingParticipantes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cambioEstadoLoading, setCambioEstadoLoading] = useState<number | null>(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  
  // Estados para el buscador y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    cargarExpedientes();
  }, []);

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtro de expedientes para el buscador
  const expedientesFiltrados = useMemo(() => {
    const filtered = expedientes.filter((expediente) =>
      expediente.codigo_expediente.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered;
  }, [expedientes, searchTerm]);

  const cargarExpedientes = async () => {
    try {
      setLoading(true);
      const response = await obtenerExpedientes();
      setExpedientes(response.data.expedientes);
    } catch (error) {
      setError('Error al cargar los expedientes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarParticipantes = async (expediente: Expediente) => {
    try {
      setLoadingParticipantes(true);
      setExpedienteSeleccionado(expediente);
      const response = await obtenerParticipantesExpediente(expediente.id);
      setParticipantes(response.data);
    } catch (error) {
      setError('Error al cargar los participantes');
      console.error('Error:', error);
    } finally {
      setLoadingParticipantes(false);
    }
  };

  const manejarCambioEstado = async (idUsuario: number) => {
    try {
      setCambioEstadoLoading(idUsuario);
      await cambiarEstadoUsuario(idUsuario);
      
      // Recargar participantes para mostrar el estado actualizado
      if (expedienteSeleccionado) {
        await cargarParticipantes(expedienteSeleccionado);
      }
    } catch (error) {
      setError('Error al cambiar el estado del usuario');
      console.error('Error:', error);
    } finally {
      setCambioEstadoLoading(null);
    }
  };

  const manejarAgregarParticipante = async (data: AgregarParticipanteRequest) => {
    if (!expedienteSeleccionado) return;

    try {
      await agregarParticipanteExpediente(expedienteSeleccionado.id, data);
      setMostrarModalAgregar(false);
      
      // Recargar participantes para mostrar el nuevo participante
      await cargarParticipantes(expedienteSeleccionado);
    } catch (error) {
      console.error('Error al agregar participante:', error);
      throw error; // Propagar el error para que lo maneje el modal
    }
  };

  const volverAExpedientes = () => {
    setExpedienteSeleccionado(null);
    setParticipantes(null);
  };

  // Función para seleccionar expediente y cargar sus participantes
  const seleccionarExpediente = (expediente: Expediente) => {
    cargarParticipantes(expediente);
  };

  // Paginación
  const totalPages = Math.ceil(expedientesFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = expedientesFiltrados.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando expedientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  // Vista de participantes de un expediente específico
  if (expedienteSeleccionado && participantes) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Participantes - {expedienteSeleccionado.codigo_expediente}
            </h1>
            <p className="text-gray-600">
              Administra demandantes y demandados del expediente
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarModalAgregar(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar Participante</span>
            </button>
            <button 
              onClick={volverAExpedientes}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Volver a Expedientes
            </button>
          </div>
        </div>

        {loadingParticipantes ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando participantes...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demandantes */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Demandantes ({participantes.demandantes.length})
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Usuarios con rol de demandante en este expediente
                </p>
              </div>
              <div className="p-6">
                {participantes.demandantes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No hay demandantes en este expediente
                  </p>
                ) : (
                  <div className="space-y-3">
                    {participantes.demandantes.map((participante) => (
                      <div
                        key={participante.id_usuario}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {participante.nombre_completo}
                          </p>
                          <p className="text-sm text-gray-600">
                            {participante.correo}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            participante.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {participante.activo ? "Activo" : "Inactivo"}
                          </span>
                          <button
                            onClick={() => manejarCambioEstado(participante.id_usuario)}
                            disabled={cambioEstadoLoading === participante.id_usuario}
                            title={participante.activo ? "Desactivar" : "Activar"}
                            className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                          >
                            {cambioEstadoLoading === participante.id_usuario ? (
                              <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                            ) : participante.activo ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Demandados */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Demandados ({participantes.demandados.length})
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Usuarios con rol de demandado en este expediente
                </p>
              </div>
              <div className="p-6">
                {participantes.demandados.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No hay demandados en este expediente
                  </p>
                ) : (
                  <div className="space-y-3">
                    {participantes.demandados.map((participante) => (
                      <div
                        key={participante.id_usuario}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {participante.nombre_completo}
                          </p>
                          <p className="text-sm text-gray-600">
                            {participante.correo}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            participante.activo 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {participante.activo ? "Activo" : "Inactivo"}
                          </span>
                          <button
                            onClick={() => manejarCambioEstado(participante.id_usuario)}
                            disabled={cambioEstadoLoading === participante.id_usuario}
                            title={participante.activo ? "Desactivar" : "Activar"}
                            className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                          >
                            {cambioEstadoLoading === participante.id_usuario ? (
                              <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                            ) : participante.activo ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ModalAgregarParticipante
          open={mostrarModalAgregar}
          onClose={() => setMostrarModalAgregar(false)}
          onSave={manejarAgregarParticipante}
        />
      </div>
    );
  }

  // Vista principal con lista de expedientes
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Participantes</h1>
                <p className="mt-1 text-slate-600">Administra los participantes (demandantes y demandados) de los expedientes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  placeholder="Buscar por código del expediente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
              <span className="font-medium text-slate-700">{expedientesFiltrados.length}</span>
              <span className="ml-1 text-slate-500">expedientes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Errores globales */}
      {error && (
        <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="border-b bg-slate-50 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">ID</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Código</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Fecha Creación</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {expedientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Users className="w-12 h-12 mb-3" />
                      <p className="text-sm font-medium">No se encontraron expedientes</p>
                      <p className="text-xs mt-1">
                        {searchTerm ? "Intenta con otro término de búsqueda" : "No hay expedientes disponibles"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((expediente) => (
                  <tr key={expediente.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 text-center">#{expediente.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">{expediente.codigo_expediente}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                        expediente.activo ?
                          'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                        {expediente.activo ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activo
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactivo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">
                      {new Date(expediente.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => seleccionarExpediente(expediente)}
                          className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50"
                          title="Gestionar participantes"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación */}
          {expedientesFiltrados.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                <span className="font-medium">{Math.min(endIndex, expedientesFiltrados.length)}</span> de{" "}
                <span className="font-medium">{expedientesFiltrados.length}</span> expedientes
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? "bg-[#132436] text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}