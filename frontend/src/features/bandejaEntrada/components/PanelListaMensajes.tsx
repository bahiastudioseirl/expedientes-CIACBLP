import React from 'react';
import { ArrowLeft, Plus, MessageCircle } from 'lucide-react';
import { obtenerNombreCompleto, formatDateOnly, extraerTituloCorto } from '../utils/chatUtils';
import { MensajeItemList } from './MensajeItemList';
import type { Mensaje, Asunto, ExpedienteAsignado } from '../schemas/BandejaEntradaSchema';

interface PanelListaMensajesProps {
  asunto: Asunto;
  expediente: ExpedienteAsignado;
  mensajes: Mensaje[];
  mensajeSeleccionado: Mensaje | null;
  loading: boolean;
  error: string;
  onGoBack: () => void;
  onNuevoMensaje: () => void;
  onSeleccionarMensaje: (mensaje: Mensaje) => void;
}

export const PanelListaMensajes: React.FC<PanelListaMensajesProps> = ({
  asunto,
  expediente,
  mensajes,
  mensajeSeleccionado,
  loading,
  error,
  onGoBack,
  onNuevoMensaje,
  onSeleccionarMensaje
}) => {
  return (
    <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
      {/* Header del panel izquierdo */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <button
              onClick={onGoBack}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0 group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-slate-900 truncate">
                {extraerTituloCorto(asunto.titulo)}
              </h1>
              <p className="text-sm text-slate-600">
                {expediente.codigo_expediente}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
            asunto.activo 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {asunto.activo ? 'Activo' : 'Cerrado'}
          </span>
        </div>

        {/* Botón Redactar */}
        {asunto.activo && (
          <button
            onClick={onNuevoMensaje}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 px-4 shadow-lg flex items-center justify-center space-x-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Redactar</span>
          </button>
        )}

        {/* Error integrado al header */}
        {error && (
          <div className="mt-4 px-4 py-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>{error}</span>
            </div>
          </div>
        )}
      </header>

      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto">
        {loading && mensajes.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : mensajes.length === 0 ? (
          <div className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No hay mensajes aún</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {mensajes.map((msg) => (
              <MensajeItemList
                key={msg.id_mensaje}
                mensaje={msg}
                isSelected={mensajeSeleccionado?.id_mensaje === msg.id_mensaje}
                onClick={() => onSeleccionarMensaje(msg)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};