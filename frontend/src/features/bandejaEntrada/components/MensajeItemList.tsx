import React from 'react';
import { User, Paperclip, MessageCircle } from 'lucide-react';
import { obtenerNombreCompleto, formatTime } from '../utils/chatUtils';
import type { Mensaje } from '../schemas/BandejaEntradaSchema';

interface MensajeItemListProps {
  mensaje: Mensaje;
  isSelected: boolean;
  onClick: () => void;
}

export const MensajeItemList: React.FC<MensajeItemListProps> = ({
  mensaje,
  isSelected,
  onClick
}) => {
  const totalRespuestas = mensaje.respuestas ? mensaje.respuestas.length : 0;
  const totalMensajes = totalRespuestas + 1; // +1 por el mensaje principal

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-900 truncate">
                {obtenerNombreCompleto(mensaje.usuario_remitente)}
              </span>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
                  {totalMensajes}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
              {formatTime(mensaje.fecha_envio)}
            </span>
          </div>
          <p className="text-sm text-slate-600 truncate">
            {mensaje.contenido}
          </p>
          <div className="flex items-center space-x-3 mt-2">
            {mensaje.adjuntos.length > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">
                  {mensaje.adjuntos.length} archivo{mensaje.adjuntos.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {totalRespuestas > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-slate-500">
                  {totalRespuestas} respuesta{totalRespuestas !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};