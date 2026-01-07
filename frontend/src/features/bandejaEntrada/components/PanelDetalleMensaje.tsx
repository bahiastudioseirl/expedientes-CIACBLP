import React from 'react';
import { Reply, MessageCircle } from 'lucide-react';
import { obtenerNombreCompleto, formatTime, extraerTituloCorto } from '../utils/chatUtils';
import { MensajeEnHilo } from './MensajeEnHilo';
import { FormularioRespuesta } from './FormularioRespuesta';
import type { Mensaje, Asunto, ExpedienteAsignado } from '../schemas/BandejaEntradaSchema';

interface PanelDetalleMensajeProps {
  asunto: Asunto;
  expediente: ExpedienteAsignado;
  mensajeSeleccionado: Mensaje;
  hiloMensajes: Mensaje[];
  loadingHilo: boolean;
  respondiendoMensaje: number | null;
  onResponderMensaje: (idMensaje: number) => void;
  onCancelarRespuesta: () => void;
  onEnviarRespuesta: (mensaje: string, adjuntos: File[], destinatarios: number[]) => Promise<boolean>;
}

export const PanelDetalleMensaje: React.FC<PanelDetalleMensajeProps> = ({
  asunto,
  expediente,
  mensajeSeleccionado,
  hiloMensajes,
  loadingHilo,
  respondiendoMensaje,
  onResponderMensaje,
  onCancelarRespuesta,
  onEnviarRespuesta
}) => {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Detalle del mensaje</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-sm text-slate-600">
                De: {obtenerNombreCompleto(mensajeSeleccionado.usuario_remitente)}
              </span>
              <span className="text-sm text-slate-500">
                {formatTime(mensajeSeleccionado.fecha_envio)}
              </span>
            </div>
          </div>
          {asunto.activo && (
            <button
              onClick={() => onResponderMensaje(mensajeSeleccionado.id_mensaje)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 font-semibold"
            >
              <Reply className="w-4 h-4" />
              <span>Responder</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="w-full">
          {loadingHilo ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-3 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <p className="text-xs text-slate-500">Cargando conversación...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Hilo de mensajes */}
              <div className="space-y-6">
                {hiloMensajes.map((msg, index) => (
                  <MensajeEnHilo
                    key={msg.id_mensaje}
                    mensaje={msg}
                    isOriginal={index === 0}
                    asuntoActivo={asunto.activo}
                    onResponder={() => onResponderMensaje(msg.id_mensaje)}
                  />
                ))}
              </div>

              {/* Formulario de respuesta si está activo */}
              {respondiendoMensaje === mensajeSeleccionado.id_mensaje && (
                <FormularioRespuesta
                  expediente={expediente}
                  onEnviar={onEnviarRespuesta}
                  onCancelar={onCancelarRespuesta}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};