import { X, FileText, User, Building2, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { Expediente } from '../schemas/ExpedienteSchema';

interface ModalVerExpedienteProps {
  open: boolean;
  onClose: () => void;
  expediente: Expediente | null;
}

export default function ModalVerExpediente({ open, onClose, expediente }: ModalVerExpedienteProps) {
  if (!open || !expediente) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-51 bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-violet-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Detalle del Expediente</h2>
              <p className="text-sm text-slate-600">Caso Arbitral N° {expediente.codigo_expediente}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Código de Expediente
                  </label>
                  <p className="text-sm font-medium text-slate-900">{expediente.codigo_expediente}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Estado
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    expediente.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Fecha de Creación
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <p className="text-sm text-slate-900">
                      {expediente.created_at ? new Date(expediente.created_at).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demandantes */}
            <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
              <h3 className="font-bold text-lg text-emerald-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                Demandante{expediente.demandante.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-4">
                {expediente.demandante.map((parte, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-emerald-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Razón Social / Nombre
                        </label>
                        <p className="text-sm font-medium text-slate-900">{parte.nombre_razon}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Número de Documento
                        </label>
                        <p className="text-sm text-slate-900">{parte.numero_documento}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Correos Electrónicos
                        </label>
                        <div className="space-y-1">
                          {parte.correos.map((correo, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <p className="text-sm text-slate-700">{correo}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Teléfono
                        </label>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-700">{parte.telefono}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demandados */}
            <div className="bg-rose-50 rounded-xl p-4 border-2 border-rose-200">
              <h3 className="font-bold text-lg text-rose-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-rose-600" />
                Demandado{expediente.demandado.length > 1 ? 's' : ''}
              </h3>
              <div className="space-y-4">
                {expediente.demandado.map((parte, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-rose-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Razón Social / Nombre
                        </label>
                        <p className="text-sm font-medium text-slate-900">{parte.nombre_razon}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Número de Documento
                        </label>
                        <p className="text-sm text-slate-900">{parte.numero_documento}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Correos Electrónicos
                        </label>
                        <div className="space-y-1">
                          {parte.correos.map((correo, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <p className="text-sm text-slate-700">{correo}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Teléfono
                        </label>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-700">{parte.telefono}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secretario Arbitral */}
            {expediente.secretario && (
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Secretario Arbitral
                </h3>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Nombre Completo
                      </label>
                      <p className="text-sm font-medium text-slate-900">{expediente.secretario.nombre_completo}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Correo Electrónico
                      </label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <p className="text-sm text-slate-700">{expediente.secretario.correo}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Teléfono
                      </label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <p className="text-sm text-slate-700">{expediente.secretario.telefono || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Árbitro */}
            {expediente.arbitro && (
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <h3 className="font-bold text-lg text-purple-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Árbitro
                </h3>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Nombre Completo
                      </label>
                      <p className="text-sm font-medium text-slate-900">{expediente.arbitro.nombre_completo}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Correo Electrónico
                      </label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <p className="text-sm text-slate-700">{expediente.arbitro.correo}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Teléfono
                      </label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <p className="text-sm text-slate-700">{expediente.arbitro.telefono || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
