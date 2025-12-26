import { X, FileText, Building2, Users, Calendar, Mail, Phone, User } from 'lucide-react';
import type { Expediente } from '../schemas/ExpedienteSchema';

interface ModalVerExpedienteProps {
  open: boolean;
  expediente: Expediente | null;
  onClose: () => void;
}

export default function ModalVerExpediente({ 
  open, 
  expediente, 
  onClose 
}: ModalVerExpedienteProps) {
  if (!open || !expediente) return null;

  const getRolParticipante = (rol: string) => {
    return expediente.participantes.find(p => 
      p.rol.toLowerCase().includes(rol.toLowerCase())
    );
  };

  const demandante = getRolParticipante("demandante");
  const demandado = getRolParticipante("demandado");
  const secretario = getRolParticipante("secretario");
  const arbitro = getRolParticipante("árbitro");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />
      
      <div className="relative z-[61] bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Detalles del Expediente</h2>
              <p className="text-xs sm:text-sm text-slate-600 truncate max-w-[200px] sm:max-w-none">{expediente.codigo_expediente}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
          <div className="space-y-4 sm:space-y-6">
            {/* Información general */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Código de Expediente
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className="font-medium text-slate-900">{expediente.codigo_expediente}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estado
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      expediente.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {expediente.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Plantilla
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-900">{expediente.plantilla.nombre}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Fecha de Creación
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg border flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-900">
                      {new Date(expediente.created_at).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Asunto */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                Asunto
              </label>
              <div className="p-3 bg-slate-50 rounded-lg border">
                <p className="text-sm sm:text-base text-slate-900 break-words">{expediente.asunto}</p>
              </div>
            </div>

            {/* Creador */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                Creado por
              </label>
              <div className="p-3 bg-slate-50 rounded-lg border flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-slate-900 truncate">
                  {expediente.usuario_creador.nombre} {expediente.usuario_creador.apellido}
                </span>
              </div>
            </div>

            {/* Participantes */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-slate-900 border-b border-slate-200 pb-2 mb-3 sm:mb-4">
                Participantes del Expediente
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Demandante */}
                {demandante && (
                  <div className="border border-slate-200 rounded-lg p-3 sm:p-4 bg-green-50">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <h4 className="font-medium text-sm sm:text-base text-green-800">Demandante</h4>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="truncate">
                          {demandante.usuario.nombre} {demandante.usuario.apellido}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="font-mono">{demandante.usuario.numero_documento}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span>{demandante.usuario.telefono}</span>
                      </div>
                      <div className="space-y-1">
                        {demandante.usuario.correos.map((correo, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                            <span className="truncate text-xs sm:text-sm">{correo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Demandado */}
                {demandado && (
                  <div className="border border-slate-200 rounded-lg p-3 sm:p-4 bg-red-50">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      <h4 className="font-medium text-sm sm:text-base text-red-800">Demandado</h4>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="truncate">
                          {demandado.usuario.nombre} {demandado.usuario.apellido}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="font-mono">{demandado.usuario.numero_documento}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span>{demandado.usuario.telefono}</span>
                      </div>
                      <div className="space-y-1">
                        {demandado.usuario.correos.map((correo, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                            <span className="truncate text-xs sm:text-sm">{correo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Secretario Arbitral */}
                {secretario && (
                  <div className="border border-slate-200 rounded-lg p-3 sm:p-4 bg-blue-50">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <h4 className="font-medium text-sm sm:text-base text-blue-800">Secretario Arbitral</h4>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="truncate">
                          {secretario.usuario.nombre} {secretario.usuario.apellido}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="font-mono">{secretario.usuario.numero_documento}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span>{secretario.usuario.telefono}</span>
                      </div>
                      <div className="space-y-1">
                        {secretario.usuario.correos.map((correo, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                            <span className="truncate text-xs sm:text-sm">{correo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Árbitro a Cargo */}
                {arbitro && (
                  <div className="border border-slate-200 rounded-lg p-3 sm:p-4 bg-purple-50">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <h4 className="font-medium text-sm sm:text-base text-purple-800">Árbitro a Cargo</h4>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="truncate">
                          {arbitro.usuario.nombre} {arbitro.usuario.apellido}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span className="font-mono">{arbitro.usuario.numero_documento}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                        <span>{arbitro.usuario.telefono}</span>
                      </div>
                      <div className="space-y-1">
                        {arbitro.usuario.correos.map((correo, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
                            <span className="truncate text-xs sm:text-sm">{correo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}