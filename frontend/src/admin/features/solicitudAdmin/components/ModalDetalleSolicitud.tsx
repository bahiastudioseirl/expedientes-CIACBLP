import { CheckCircle, FileText, Eye, Users, User, Shield } from "lucide-react";
import type { Solicitud } from "../schemas/SolicitudSchema";

interface ModalDetalleSolicitudProps {
  solicitud: Solicitud | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalDetalleSolicitud({
  solicitud,
  isOpen,
  onClose
}: ModalDetalleSolicitudProps) {
  if (!isOpen) return null;

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header del Modal */}
        <div className="p-6 bg-gradient-to-r from-violet-50 to-blue-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <FileText className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Solicitud #{solicitud?.id}</h2>
                <p className="text-sm text-slate-600">Detalles completos de la solicitud</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido del Modal con scroll */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!solicitud ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-600">No hay datos para mostrar</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Estado y Fecha */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estado Actual</label>
                  <span className={`px-3 py-1.5 text-sm font-medium rounded-full inline-flex items-center ${solicitud.estado === "admitida"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    }`}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de Envío</label>
                  <p className="text-slate-900 font-medium">{formatFecha(solicitud.created_at)}</p>
                </div>
              </div>

              {/* Partes Involucradas */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Partes Involucradas
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {solicitud.partes.map(parte => (
                    <div key={parte.id} className={`p-5 rounded-xl border-2 ${parte.tipo === 'demandante'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-rose-50 border-rose-200'
                      }`}>
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg ${parte.tipo === 'demandante' ? 'bg-emerald-100' : 'bg-rose-100'
                          }`}>
                          <User className={`w-4 h-4 ${parte.tipo === 'demandante' ? 'text-emerald-600' : 'text-rose-600'
                            }`} />
                        </div>
                        <h4 className={`font-bold text-lg ml-2 capitalize ${parte.tipo === 'demandante' ? 'text-emerald-800' : 'text-rose-800'
                          }`}>
                          {parte.tipo}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Razón Social</span>
                          <p className="font-semibold text-slate-900">{parte.nombre_razon}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Documento</span>
                            <p className="text-sm text-slate-800">{parte.numero_documento}</p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Teléfono</span>
                            <p className="text-sm text-slate-800">{parte.telefono}</p>
                          </div>
                        </div>

                        {/* Correos */}
                        <div className="mt-3">
                          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Correos</span>
                          <div className="space-y-1 mt-1">
                            {parte.correos.map(correo => (
                              <div key={correo.id} className="flex items-center">
                                <span className="text-sm text-slate-800">{correo.correo}</span>
                                {correo.es_principal && (
                                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Principal</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Representantes */}
                        {parte.representantes && parte.representantes.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-300">
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Representante Legal</span>
                            <div className="mt-2 space-y-1">
                              <p className="font-medium text-slate-900">{parte.representantes[0].nombre_completo}</p>
                              <div className="flex space-x-4 text-sm text-slate-600">
                                <span>Doc: {parte.representantes[0].numero_documento}</span>
                                <span>Tel: {parte.representantes[0].telefono}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de Controversia */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  Resumen de Controversia
                </h3>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <p className="text-slate-800 leading-relaxed">{solicitud.resumen_controversia}</p>
                </div>
              </div>

              {/* Pretensiones */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                  Pretensiones ({solicitud.pretensiones.length})
                </h3>
                <div className="space-y-3">
                  {solicitud.pretensiones.map((pretension, index) => (
                    <div key={pretension.id} className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                            <span className="ml-3 px-2 py-1 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                              {pretension.determinada}
                            </span>
                          </div>
                          <p className="text-slate-800">{pretension.descripcion}</p>
                          {pretension.cuantia && (
                            <p className="text-sm text-purple-700 mt-2 font-medium">
                              Cuantía: S/ {pretension.cuantia.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medida Cautelar y Designación */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {solicitud.medida_cautelar && (
                  <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-red-600" />
                      Medida Cautelar
                    </h3>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-slate-800 leading-relaxed">{solicitud.medida_cautelar}</p>
                    </div>
                  </div>
                )}

                <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Designación Arbitral
                  </h3>
                  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-slate-700 w-24">Tipo:</span>
                      <span className="text-slate-800 font-medium">
                        {solicitud.designacion_arbitral.arbitro_unico ? 'Árbitro Único' : 'Tribunal Arbitral'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-slate-700 w-24">Encargo:</span>
                      <span className="text-slate-800">
                        {solicitud.designacion_arbitral.encarga_ciacblp ? 'CIACBLP designa' : 'Partes proponen'}
                      </span>
                    </div>

                    {/* Mostrar información del árbitro si existe */}
                    {solicitud.designacion_arbitral.arbitro && (
                      <div className="mt-4 pt-3 border-t border-indigo-200">
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-slate-700">Árbitro Propuesto:</span>
                        </div>
                        <div className="bg-white/60 p-3 rounded-lg space-y-2">
                          <div>
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre:</span>
                            <p className="font-medium text-slate-900">{solicitud.designacion_arbitral.arbitro.nombre_completo}</p>
                          </div>
                          {solicitud.designacion_arbitral.arbitro.correo && (
                            <div>
                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Correo:</span>
                              <p className="text-sm text-slate-800">{solicitud.designacion_arbitral.arbitro.correo}</p>
                            </div>
                          )}
                          {solicitud.designacion_arbitral.arbitro.telefono && (
                            <div>
                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Teléfono:</span>
                              <p className="text-sm text-slate-800">{solicitud.designacion_arbitral.arbitro.telefono}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Link de Anexo */}
              {solicitud.link_anexo && (
                <div className="bg-white border-2 border-slate-200 rounded-xl p-6">

                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-600" />
                      Documento Anexo
                    </h3>

                    <a
                      href={solicitud.link_anexo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </a>
                  </div>

                </div>
              )}


            </div>
          )}
        </div>
      </div>
    </div>
  );
}