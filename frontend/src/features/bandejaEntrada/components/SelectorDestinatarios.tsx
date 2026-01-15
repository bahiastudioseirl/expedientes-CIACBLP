import React from 'react';
import { User } from 'lucide-react';
import { obtenerNombreCompleto, getValidParticipantes } from '../utils/chatUtils';
import type { ExpedienteAsignado } from '../schemas/BandejaEntradaSchema';

interface SelectorDestinatariosProps {
  expediente: ExpedienteAsignado;
  destinatariosSeleccionados: number[];
  onToggleDestinatario: (idUsuario: number) => void;
  onToggleRol?: (rol: string, seleccionar: boolean) => void;
  variant?: 'normal' | 'response';
  currentUser?: {
    id_usuario: number;
    id_rol: number;
    nombre: string;
  };
  deshabilitado?: boolean;
}

export const SelectorDestinatarios: React.FC<SelectorDestinatariosProps> = ({
  expediente,
  destinatariosSeleccionados,
  onToggleDestinatario,
  onToggleRol,
  variant = 'normal',
  currentUser,
  deshabilitado = false
}) => {
  const isCheckboxDisabled = (rol: string, participante: any) => {
    if (!currentUser) return false;

    const esElMismoUsuario = participante.usuario.id_usuario === currentUser.id_usuario;
    
    if (participante.usuario.id_usuario === currentUser.id_usuario) {
      console.log('BLOQUEANDO USUARIO:', {
        participanteId: participante.usuario.id_usuario,
        currentUserId: currentUser.id_usuario,
        esElMismo: esElMismoUsuario
      });
    }
    
    if (esElMismoUsuario) return true;

    if (currentUser.id_rol === 1) return false;

    if (currentUser.id_rol === 2 || currentUser.id_rol === 3) return false;

    if (currentUser.id_rol === 4) {
      
      return rol === 'Secretario' || rol === 'Arbitro' || rol === 'Administrador';
    }

    if (currentUser.id_rol === 5) { 
      return rol === 'Secretario' || rol === 'Arbitro' || rol === 'Administrador';
    }

    return false;
  };

  // Función para determinar si el checkbox de "seleccionar todos" debe estar deshabilitado
  const isSelectAllDisabled = (rol: string) => {
    if (!currentUser) return false;

    // Administradores, Secretarios y Árbitros pueden manejar todo
    if (currentUser.id_rol === 1 || currentUser.id_rol === 2 || currentUser.id_rol === 3) return false;

    // Para Demandados y Demandantes, deshabilitar "seleccionar todos" para roles staff
    if (currentUser.id_rol === 4 || currentUser.id_rol === 5) {
      return rol === 'Secretario' || rol === 'Arbitro' || rol === 'Administrador';
    }

    return false;
  };

  const participantesValidos = getValidParticipantes(expediente);
  
  // Agrupar participantes por rol
  const participantesPorRol = participantesValidos.reduce((grupos: any, participante: any) => {
    const rolNombre = participante.usuario?.rol?.nombre || 'Sin rol';
    if (!grupos[rolNombre]) {
      grupos[rolNombre] = [];
    }
    grupos[rolNombre].push(participante);
    return grupos;
  }, {});

  // Ordenar roles según prioridad
  const rolesOrden = ['Demandante', 'Demandado', 'Secretario', 'Arbitro', 'Administrador'];
  const rolesOrdenados = Object.keys(participantesPorRol).sort((a, b) => {
    const indexA = rolesOrden.indexOf(a);
    const indexB = rolesOrden.indexOf(b);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
  
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

  // Función para verificar si todos los participantes de un rol están seleccionados
  const todosSeleccionadosEnRol = (participantesRol: any[]) => {
    return participantesRol.every(p => destinatariosSeleccionados.includes(p.usuario.id_usuario));
  };

  // Función para alternar selección de todo un rol
  const toggleTodoRol = (rol: string, seleccionar: boolean) => {
    if (onToggleRol) {
      onToggleRol(rol, seleccionar);
    } else {
      // Fallback: alternar individualmente cada participante del rol
      participantesPorRol[rol].forEach((participante: any) => {
        const estaSeleccionado = destinatariosSeleccionados.includes(participante.usuario.id_usuario);
        if (seleccionar && !estaSeleccionado) {
          onToggleDestinatario(participante.usuario.id_usuario);
        } else if (!seleccionar && estaSeleccionado) {
          onToggleDestinatario(participante.usuario.id_usuario);
        }
      });
    }
  };

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
        {rolesOrdenados.map((rol) => (
          <div key={rol} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-sm font-semibold text-slate-700">{rol}</h4>
              <label className={`flex items-center space-x-2 ${
                deshabilitado || isSelectAllDisabled(rol) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}>
                <input
                  type="checkbox"
                  checked={todosSeleccionadosEnRol(participantesPorRol[rol])}
                  onChange={(e) => !(deshabilitado || isSelectAllDisabled(rol)) && toggleTodoRol(rol, e.target.checked)}
                  disabled={deshabilitado || isSelectAllDisabled(rol)}
                  className={`w-4 h-4 rounded focus:ring-2 ${
                    deshabilitado || isSelectAllDisabled(rol) 
                      ? 'cursor-not-allowed opacity-50' 
                      : checkboxClasses
                  }`}
                />
                <span className={`text-xs ${
                  isSelectAllDisabled(rol) ? 'text-slate-400' : 'text-slate-600'
                }`}>Seleccionar todos</span>
              </label>
            </div>
            {participantesPorRol[rol].map((participante: any) => (
              <label
                key={participante.usuario.id_usuario}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  deshabilitado || isCheckboxDisabled(rol, participante) 
                    ? 'cursor-not-allowed opacity-60 bg-slate-100' 
                    : `cursor-pointer ${baseClasses}`
                }`}
              >
                <input
                  type="checkbox"
                  checked={destinatariosSeleccionados.includes(participante.usuario.id_usuario)}
                  onChange={() => !(deshabilitado || isCheckboxDisabled(rol, participante)) && onToggleDestinatario(participante.usuario.id_usuario)}
                  disabled={deshabilitado || isCheckboxDisabled(rol, participante)}
                  className={`w-4 h-4 rounded focus:ring-2 ${
                    deshabilitado || isCheckboxDisabled(rol, participante)
                      ? 'cursor-not-allowed opacity-50'
                      : checkboxClasses
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 bg-gradient-to-br ${avatarClasses} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <User className={`w-3 h-3 ${avatarIconClasses}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {participante.usuario.nombre_completo || 'Sin nombre'}
                      </p>
                      <p className="text-xs text-slate-600 truncate">
                        {participante.usuario.correo}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
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
        {destinatariosSeleccionados.length === 0 && !deshabilitado && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠️ Debes seleccionar al menos un destinatario para enviar el mensaje.
            </p>
          </div>
        )}
        <div className={`space-y-4 p-4 rounded-xl border ${
          (variant as string) === 'response' ? 'bg-white border-blue-300' : 'bg-slate-50 border-slate-200'
        }`}>
          {rolesOrdenados.map((rol) => (
            <div key={rol} className="space-y-2">
              <div className="flex items-center justify-between px-1 py-2 border-b border-slate-300">
                <h4 className="text-sm font-semibold text-slate-700">
                  {rol} ({participantesPorRol[rol].length})
                </h4>
                <label className={`flex items-center space-x-2 ${
                  deshabilitado || isSelectAllDisabled(rol) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}>
                  <input
                    type="checkbox"
                    checked={todosSeleccionadosEnRol(participantesPorRol[rol])}
                    onChange={(e) => !(deshabilitado || isSelectAllDisabled(rol)) && toggleTodoRol(rol, e.target.checked)}
                    disabled={deshabilitado || isSelectAllDisabled(rol)}
                    className={`w-4 h-4 rounded focus:ring-2 ${
                      deshabilitado || isSelectAllDisabled(rol) 
                        ? 'cursor-not-allowed opacity-50' 
                        : checkboxClasses
                    }`}
                  />
                  <span className={`text-xs ${
                    isSelectAllDisabled(rol) ? 'text-slate-400' : 'text-slate-600'
                  }`}>Seleccionar todos</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {participantesPorRol[rol].map((participante: any) => (
                  <label
                    key={participante.usuario.id_usuario}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      deshabilitado || isCheckboxDisabled(rol, participante) 
                        ? 'cursor-not-allowed opacity-60 bg-slate-100' 
                        : `cursor-pointer ${baseClasses}`
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={destinatariosSeleccionados.includes(participante.usuario.id_usuario)}
                      onChange={() => !(deshabilitado || isCheckboxDisabled(rol, participante)) && onToggleDestinatario(participante.usuario.id_usuario)}
                      disabled={deshabilitado || isCheckboxDisabled(rol, participante)}
                      className={`w-4 h-4 rounded focus:ring-2 ${
                        deshabilitado || isCheckboxDisabled(rol, participante)
                          ? 'cursor-not-allowed opacity-50'
                          : checkboxClasses
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 bg-gradient-to-br ${avatarClasses} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <User className={`w-3 h-3 ${avatarIconClasses}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {participante.usuario.nombre_completo || 'Sin nombre'}
                          </p>
                          <p className="text-xs text-slate-600 truncate">
                            {participante.usuario.correo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};