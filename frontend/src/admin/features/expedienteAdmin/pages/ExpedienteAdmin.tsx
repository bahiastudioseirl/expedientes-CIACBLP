import { useEffect, useMemo, useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Edit, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ToggleLeft, 
  ToggleRight,
  Building2,
  Users,
  Calendar
} from 'lucide-react';
import ModalAgregarExpediente from '../components/ModalAgregarExpediente';
import ModalVerExpediente from '../components/ModalVerExpediente';
import ModalEditarExpediente from '../components/ModalEditarExpediente';
import { crearExpediente } from '../services/crearExpediente';
import { obtenerExpedientes } from '../services/obtenerExpedientes';
import { cambiarEstadoExpediente, actualizarExpediente } from '../services/actualizarExpediente';
import type { 
  CrearExpedienteRequest, 
  ActualizarExpedienteRequest,
  Expediente,
  UsuarioInfo 
} from '../schemas/ExpedienteSchema';

export default function ExpedienteAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const openModal = () => setIsModalOpen(true);

  useEffect(() => {
    cargarExpedientes();
  }, []);

  const cargarExpedientes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await obtenerExpedientes();
      if (response.success) {
        const expedientesOrdenados = response.data.expedientes.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setExpedientes(expedientesOrdenados);
      }
    } catch (err: any) {
      console.error("Error al cargar expedientes:", err);
      const msg = err?.response?.data?.message || "Error al cargar los expedientes";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return expedientes.filter(expediente =>
      expediente.codigo_expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expediente.asunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expediente.plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expedientes, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSaveExpediente = async (data: CrearExpedienteRequest) => {
    setSaving(true);
    setError("");
    try {
      const response = await crearExpediente(data);

      if (response.success) {
        setExpedientes((prev) => {
          const nuevaLista = [response.data.expediente, ...prev];
          return nuevaLista;
        });
        setIsModalOpen(false);
        
        // Mostrar información de usuarios creados/actualizados
        if (response.data.usuarios_info.length > 0) {
          mostrarInfoUsuarios(response.data.usuarios_info);
        }
      }
    } catch (err: any) {
      console.error("Error al crear expediente:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo crear el expediente.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const mostrarInfoUsuarios = (usuariosInfo: UsuarioInfo[]) => {
    const usuariosCreados = usuariosInfo.filter(info => info.accion === "creado");
    const usuariosActualizados = usuariosInfo.filter(info => info.accion === "actualizado");

    let mensaje = "";
    if (usuariosCreados.length > 0) {
      mensaje += `Usuarios creados: ${usuariosCreados.map(info => `${info.usuario.nombre} ${info.usuario.apellido}`).join(", ")}. `;
    }
    if (usuariosActualizados.length > 0) {
      mensaje += `Usuarios actualizados: ${usuariosActualizados.map(info => `${info.usuario.nombre} ${info.usuario.apellido}`).join(", ")}.`;
    }

    // Aquí podrías usar una notificación toast
    console.log("Info usuarios:", mensaje);
  };

  const handleCambiarEstado = async (id: number, estadoActual: boolean) => {
    setError("");
    try {
      const response = await cambiarEstadoExpediente(id);

      if (response.success) {
        setExpedientes((prev) =>
          prev.map((expediente) =>
            expediente.id_expediente === id
              ? { ...expediente, activo: !estadoActual }
              : expediente
          )
        );
      }
    } catch (err: any) {
      console.error("Error al cambiar estado del expediente:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo cambiar el estado del expediente.";
      setError(msg);
    }
  };

  const handleViewExpediente = (expediente: Expediente) => {
    setSelectedExpediente(expediente);
    setIsViewModalOpen(true);
  };

  const handleEditExpediente = (expediente: Expediente) => {
    setSelectedExpediente(expediente);
    setIsEditModalOpen(true);
  };

  const handleUpdateExpediente = async (id: number, data: ActualizarExpedienteRequest) => {
    setSaving(true);
    setError("");
    try {
      const response = await actualizarExpediente(id, data);

      if (response.success) {
        setExpedientes((prev) =>
          prev.map((exp) => (exp.id_expediente === id ? response.data.expediente : exp))
        );
        setIsEditModalOpen(false);
        setSelectedExpediente(null);
        
        // Mostrar información de usuarios actualizados
        if (response.data.usuarios_info.length > 0) {
          mostrarInfoUsuarios(response.data.usuarios_info);
        }
      }
    } catch (err: any) {
      console.error("Error al actualizar expediente:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo actualizar el expediente.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const getRolParticipante = (participantes: any[], rol: string) => {
    const participante = participantes.find(p => p.rol.toLowerCase().includes(rol.toLowerCase()));
    return participante ? `${participante.usuario.nombre} ${participante.usuario.apellido}` : "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Gestión de Expedientes</h1>
                <p className="mt-1 text-sm text-slate-600 hidden sm:block">Administra los expedientes del sistema</p>
              </div>
            </div>
            <button
              onClick={openModal}
              className="flex items-center justify-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666] w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo expediente</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-full lg:max-w-md">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  placeholder="Buscar expedientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
              <span className="font-medium text-slate-700">{filteredData.length}</span>
              <span className="ml-1 text-slate-500">registros</span>
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

      {/* Estado de carga */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-sm text-slate-600">Cargando expedientes...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Vista desktop */}
          <div className="hidden lg:block overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead className="border-b bg-slate-50 border-slate-200">
                  <tr>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Código</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Asunto</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Plantilla</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Demandante</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Estado</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Creado</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FileText className="w-12 h-12 mb-3" />
                        <p className="text-sm font-medium">No se encontraron expedientes</p>
                        <p className="text-xs mt-1">
                          {searchTerm ? "Intenta con otro término de búsqueda" : "Crea tu primer expediente"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((expediente) => (
                    <tr key={expediente.id_expediente} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">
                        {expediente.codigo_expediente}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-800 max-w-xs">
                        <div className="truncate" title={expediente.asunto}>
                          {expediente.asunto}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <div className="flex items-center justify-center space-x-1">
                          <Building2 className="w-4 h-4" />
                          <span>{expediente.plantilla.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {getRolParticipante(expediente.participantes, "demandante")}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                          expediente.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
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
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <div className="flex items-center justify-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(expediente.created_at).toLocaleDateString('es-PE', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleViewExpediente(expediente)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleEditExpediente(expediente)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCambiarEstado(expediente.id_expediente, expediente.activo)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              expediente.activo 
                                ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                            title={expediente.activo ? "Desactivar" : "Activar"}
                          >
                            {expediente.activo ? (
                              <ToggleLeft className="w-4 h-4" />
                            ) : (
                              <ToggleRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Paginación */}
            {filteredData.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                  <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> de{" "}
                  <span className="font-medium">{filteredData.length}</span> expedientes
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

        <div className="lg:hidden space-y-4">
          {filteredData.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No hay expedientes</h3>
              <p className="text-slate-600">No se encontraron expedientes que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            paginatedData.map((expediente) => (
              <div key={expediente.id_expediente} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                {/* Header del card */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {expediente.codigo_expediente}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {expediente.asunto.length > 50 
                        ? `${expediente.asunto.substring(0, 50)}...` 
                        : expediente.asunto}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                      expediente.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
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
                  </div>
                </div>

                {/* Información del card */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-600 truncate">{expediente.plantilla.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-600 truncate">
                      {getRolParticipante(expediente.participantes, "demandante")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 col-span-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-600">
                      Creado: {new Date(expediente.created_at).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Acciones del card */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewExpediente(expediente)}
                      className="flex items-center space-x-1 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Ver</span>
                    </button>
                    <button
                      onClick={() => handleEditExpediente(expediente)}
                      className="flex items-center space-x-1 p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-xs">Editar</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleCambiarEstado(expediente.id_expediente, expediente.activo)}
                    className="flex items-center space-x-1 p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    disabled={saving}
                  >
                    {expediente.activo ? (
                      <ToggleRight className="w-4 h-4" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                    <span className="text-xs">
                      {expediente.activo ? 'Desactivar' : 'Activar'}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Paginación mobile */}
          {filteredData.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex flex-col space-y-3">
                <div className="text-center text-sm text-slate-600">
                  <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> de <span className="font-medium">{filteredData.length}</span>
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="flex items-center px-3 py-2 text-sm text-slate-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      )}

      {/* Modal Agregar */}
      <ModalAgregarExpediente
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpediente}
        loading={saving}
      />

      {/* Modal Ver */}
      <ModalVerExpediente
        open={isViewModalOpen}
        expediente={selectedExpediente}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedExpediente(null);
        }}
      />

      {/* Modal Editar */}
      <ModalEditarExpediente
        open={isEditModalOpen}
        expediente={selectedExpediente}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpediente(null);
        }}
        onSave={handleUpdateExpediente}
        loading={saving}
      />
    </div>
  );
}
