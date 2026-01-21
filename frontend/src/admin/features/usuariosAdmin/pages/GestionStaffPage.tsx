import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Settings,
  AlertCircle, 
  Search,
  UserCheck,
  Trash2
} from 'lucide-react';
import { 
  obtenerExpedientes, 
  obtenerStaffExpediente,
  desvincularStaffDeExpediente
} from '../services/usuariosService';
import type { 
  Expediente
} from '../schemas/UsuarioSchema';
import ModalVincularStaff from '../components/ModalVincularStaff';

export default function GestionStaffPage() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<Expediente | null>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalStaff, setMostrarModalStaff] = useState(false);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [usuarioADesvincular, setUsuarioADesvincular] = useState<any | null>(null);
  
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

  const cargarStaff = async (expediente: Expediente) => {
    try {
      setLoadingStaff(true);
      setExpedienteSeleccionado(expediente);
      const response = await obtenerStaffExpediente(expediente.id);
      setStaff(response.data.usuarios || []);
    } catch (error) {
      setError('Error al cargar el staff');
      console.error('Error:', error);
    } finally {
      setLoadingStaff(false);
    }
  };

  const manejarVincularStaff = async () => {
    setMostrarModalStaff(false);
    if (expedienteSeleccionado) {
      await cargarStaff(expedienteSeleccionado);
    }
  };

  const abrirModalDesvincular = (usuario: any) => {
    setUsuarioADesvincular(usuario);
    setMostrarModalConfirmacion(true);
  };

  const confirmarDesvinculacion = async () => {
    if (usuarioADesvincular && expedienteSeleccionado) {
      try {
        await desvincularStaffDeExpediente(usuarioADesvincular.id_usuario, expedienteSeleccionado.id);
        setMostrarModalConfirmacion(false);
        setUsuarioADesvincular(null);
        // Recargar el staff
        await cargarStaff(expedienteSeleccionado);
      } catch (error) {
        setError('Error al desvincular el usuario');
        console.error('Error:', error);
      }
    }
  };

  const cancelarDesvinculacion = () => {
    setMostrarModalConfirmacion(false);
    setUsuarioADesvincular(null);
  };

  const volverAExpedientes = () => {
    setExpedienteSeleccionado(null);
    setStaff([]);
  };

  // Función para seleccionar expediente y cargar su staff
  const seleccionarExpediente = (expediente: Expediente) => {
    cargarStaff(expediente);
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

  // Vista de staff de un expediente específico
  if (expedienteSeleccionado) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Autoridades - {expedienteSeleccionado.codigo_expediente}
            </h1>
            <p className="text-gray-600">
              Administra árbitros y secretarios del expediente
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarModalStaff(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Vincular Usuario</span>
            </button>
            <button 
              onClick={volverAExpedientes}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Volver a Expedientes
            </button>
          </div>
        </div>

        {loadingStaff ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando staff...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Staff del Expediente ({staff.length})
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Árbitros y secretarios asignados a este expediente
              </p>
            </div>
            <div className="p-6">
              {staff.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No hay staff asignado</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Este expediente aún no tiene árbitros o secretarios asignados
                  </p>
                  <button
                    onClick={() => setMostrarModalStaff(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center mx-auto space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Vincular Primer Staff</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staff.map((miembro) => (
                    <div
                      key={miembro.id_usuario}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-blue-900 mb-1">
                            {miembro.nombre_completo}
                          </p>
                          <p className="text-sm text-blue-700 mb-2">
                            {miembro.correo}
                          </p>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-200 text-blue-800 rounded-full">
                            {miembro.rol}
                          </span>
                        </div>
                        <button
                          onClick={() => abrirModalDesvincular(miembro)}
                          className="ml-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Desvincular usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <ModalVincularStaff
          open={mostrarModalStaff}
          onClose={() => setMostrarModalStaff(false)}
          onSave={manejarVincularStaff}
          expedienteId={expedienteSeleccionado?.id || 0}
        />

        {/* Modal de confirmación para desvincular */}
        {mostrarModalConfirmacion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-red-50 rounded-lg mr-3">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Desvinculación</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres desvincular a <span className="font-semibold">{usuarioADesvincular?.nombre_completo}</span> del expediente <span className="font-semibold">{expedienteSeleccionado?.codigo_expediente}</span>?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelarDesvinculacion}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarDesvinculacion}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sí, Desvincular
                </button>
              </div>
            </div>
          </div>
        )}
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
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de Autoridades</h1>
                <p className="mt-1 text-slate-600">Administra los árbitros, secretarios y contadores de los expedientes</p>
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
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Fecha Creación</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {expedientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-slate-400 mb-3" />
                      <p className="text-slate-500 font-medium">No se encontraron expedientes</p>
                      <p className="text-slate-400 text-sm">Prueba con otros términos de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((expediente) => (
                  <tr key={expediente.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 text-center">#{expediente.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">{expediente.codigo_expediente}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">
                      {new Date(expediente.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => seleccionarExpediente(expediente)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                      </button>
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
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
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