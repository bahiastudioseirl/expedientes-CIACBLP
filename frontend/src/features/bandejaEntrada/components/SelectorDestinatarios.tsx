import React from 'react';
import { User } from 'lucide-react';
import { obtenerNombreCompleto, getValidParticipantes } from '../utils/chatUtils';
import type { ExpedienteAsignado } from '../schemas/BandejaEntradaSchema';

interface SelectorDestinatariosProps {
  expediente: ExpedienteAsignado;
  destinatariosSeleccionados: number[];
  onToggleDestinatario: (idUsuario: number) => void;
  variant?: 'normal' | 'response';
}

export const SelectorDestinatarios: React.FC<SelectorDestinatariosProps> = ({
  expediente,
  destinatariosSeleccionados,
  onToggleDestinatario,
  variant = 'normal'
}) => {
  const participantesValidos = getValidParticipantes(expediente);
  
  const baseClasses = variant === 'response'
    ? 'bg-blue-50 border-blue-200 hover:border-blue-400'
    : 'bg-white border-slate-200 hover:border-blue-300';

  const avatarClasses = variant === 'response'
    ? 'from-blue-200 to-blue-300'
    : 'from-slate-200 to-slate-300';

  const avatarIconClasses = variant === 'response'
    ? 'text-blue-600'
    : 'text-slate-600';

  const roleClasses = variant === 'response'
    ? 'text-blue-600'
    : 'text-slate-500';

  const checkboxClasses = variant === 'response'
    ? 'text-blue-600 border-blue-300 focus:ring-blue-500'
    : 'text-blue-600 border-slate-300 focus:ring-blue-500';

  if (participantesValidos.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-slate-500">No hay participantes disponibles</p>
      </div>
    );
  }

  // Si variant es 'response', no mostrar el label y warning aquí ya que son manejados por el componente padre
  if (variant === 'response') {
    return (
      <>
        {participantesValidos.map((participante: any) => (
          <label
            key={participante.usuario.id_usuario}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${baseClasses}`}
          >
            <input
              type="checkbox"
              checked={destinatariosSeleccionados.includes(participante.usuario.id_usuario)}
              onChange={() => onToggleDestinatario(participante.usuario.id_usuario)}
              className={`w-4 h-4 rounded focus:ring-2 ${checkboxClasses}`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 bg-gradient-to-br ${avatarClasses} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <User className={`w-3 h-3 ${avatarIconClasses}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {obtenerNombreCompleto(participante.usuario)}
                  </p>
                  <p className={`text-xs ${roleClasses}`}>
                    {participante.rol_en_expediente}
                  </p>
                </div>
              </div>
            </div>
          </label>
        ))}
      </>
    );
  }

  return (
    <>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Destinatarios ({destinatariosSeleccionados.length}/{participantesValidos.length})
        </label>
        {destinatariosSeleccionados.length === 0 && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠️ Debes seleccionar al menos un destinatario para enviar el mensaje.
            </p>
          </div>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border ${
          variant === 'response' ? 'bg-white border-blue-300' : 'bg-slate-50 border-slate-200'
        }`}>
          {participantesValidos.map((participante: any) => (
            <label
              key={participante.usuario.id_usuario}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${baseClasses}`}
            >
              <input
                type="checkbox"
                checked={destinatariosSeleccionados.includes(participante.usuario.id_usuario)}
                onChange={() => onToggleDestinatario(participante.usuario.id_usuario)}
                className={`w-4 h-4 rounded focus:ring-2 ${checkboxClasses}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 bg-gradient-to-br ${avatarClasses} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <User className={`w-3 h-3 ${avatarIconClasses}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {obtenerNombreCompleto(participante.usuario)}
                    </p>
                    <p className={`text-xs ${roleClasses}`}>
                      {participante.rol_en_expediente}
                    </p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};