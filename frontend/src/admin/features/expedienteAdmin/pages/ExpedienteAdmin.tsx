import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  UserPlus,
  UserCheck,
  Settings
} from 'lucide-react';
import ModalCrearExpedienteDesdeSolicitud from '../components/ModalCrearExpedienteDesdeSolicitud';
import ModalVerExpediente from '../components/ModalVerExpediente';
import ModalAgregarArbitro from '../components/ModalAgregarArbitro';
import ModalGestionFlujo from '../components/ModalGestionFlujo';
import { useExpedienteAdmin } from '../hooks/useExpedienteAdmin';

export default function ExpedienteAdmin() {
  const {
    // Estados
    expedientes,
    paginatedData,
    searchTerm,
    currentPage,
    loading,
    error,
    
    // Modales
    isModalDesdeSolicitud,
    idSolicitudParaExpediente,
    isViewModalOpen,
    isAgregarArbitroModalOpen,
    isGestionFlujoModalOpen,
    selectedExpediente,
    
    // Paginación
    totalPages,
    startIndex,
    endIndex,
    
    // Acciones
    setSearchTerm,
    setCurrentPage,
    handleCloseModalDesdeSolicitud,
    handleSuccessCrearExpediente,
    handleViewExpediente,
    handleOpenAgregarArbitroModal,
    handleCloseAgregarArbitroModal,
    handleSuccessAgregarArbitro,
    handleOpenGestionFlujoModal,
    handleCloseGestionFlujoModal,
    handleSuccessGestionFlujo,
    handleCloseViewModal,
    getNombreDemandante,
    getNombreDemandado,
  } = useExpedienteAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-violet-50">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Gestión de Expedientes</h1>
                <p className="mt-1 text-sm text-slate-600 hidden sm:block">Expedientes creados desde solicitudes admitidas</p>
              </div>
            </div>
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
              <span className="font-medium text-slate-700">{expedientes.length}</span>
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
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Demandante</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Demandado</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Estado</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Creado</th>
                    <th className="px-4 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {expedientes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
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
                      <tr key={expediente.id} className="transition-colors hover:bg-slate-50">
                        <td className="px-4 py-4 text-sm font-medium text-slate-900">
                          Caso Arbitral N° {expediente.codigo_expediente}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {getNombreDemandante(expediente)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {getNombreDemandado(expediente)}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${expediente.activo
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
                              {expediente.created_at ? new Date(expediente.created_at).toLocaleDateString('es-PE', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              }) : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewExpediente(expediente)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver expediente"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenGestionFlujoModal(expediente)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Gestionar flujo del expediente"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            {expediente.arbitro ? (
                              <button
                                disabled
                                className="p-2 text-green-600 bg-green-50 rounded-lg cursor-not-allowed"
                                title={`Árbitro asignado: ${expediente.arbitro.nombre_completo}`}
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenAgregarArbitroModal(expediente)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Agregar árbitro"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Paginación */}
              {expedientes.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                    <span className="font-medium">{Math.min(endIndex, expedientes.length)}</span> de{" "}
                    <span className="font-medium">{expedientes.length}</span> expedientes
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
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg ${currentPage === page
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


        </>
      )}

      {/* Modal Crear desde Solicitud */}
      {idSolicitudParaExpediente && (
        <ModalCrearExpedienteDesdeSolicitud
          open={isModalDesdeSolicitud}
          onClose={handleCloseModalDesdeSolicitud}
          onSuccess={handleSuccessCrearExpediente}
          idSolicitud={idSolicitudParaExpediente}
        />
      )}

      {/* Modal Ver Expediente */}
      <ModalVerExpediente
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        expediente={selectedExpediente}
      />

      {/* Modal Agregar Árbitro */}
      {selectedExpediente && (
        <ModalAgregarArbitro
          open={isAgregarArbitroModalOpen}
          onClose={handleCloseAgregarArbitroModal}
          idExpediente={selectedExpediente.id}
          onSuccess={handleSuccessAgregarArbitro}
        />
      )}

      {/* Modal Gestión de Flujo */}
      {selectedExpediente && isGestionFlujoModalOpen && (
        <ModalGestionFlujo
          expedienteId={selectedExpediente.id}
          codigoExpediente={selectedExpediente.codigo_expediente}
          onClose={handleCloseGestionFlujoModal}
          onSuccess={handleSuccessGestionFlujo}
        />
      )}

    </div>
  );
}
