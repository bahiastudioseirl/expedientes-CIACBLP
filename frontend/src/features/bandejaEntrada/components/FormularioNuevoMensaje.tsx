import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, User } from 'lucide-react';
import { obtenerNombreCompleto, getAllParticipanteIds } from '../utils/chatUtils';
import { SelectorDestinatarios } from './SelectorDestinatarios';
import type { ExpedienteAsignado } from '../schemas/BandejaEntradaSchema';

interface FormularioNuevoMensajeProps {
  expediente: ExpedienteAsignado;
  onEnviar: (mensaje: string, adjuntos: File[], destinatarios: number[]) => Promise<boolean>;
  onCancelar: () => void;
}

export const FormularioNuevoMensaje: React.FC<FormularioNuevoMensajeProps> = ({
  expediente,
  onEnviar,
  onCancelar
}) => {
  const [mensaje, setMensaje] = useState('');
  const [adjuntos, setAdjuntos] = useState<File[]>([]);
  const [destinatariosSeleccionados, setDestinatariosSeleccionados] = useState<number[]>(
    getAllParticipanteIds(expediente)
  );
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdjuntos(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAdjuntos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDestinatario = (idUsuario: number) => {
    setDestinatariosSeleccionados(prev => {
      if (prev.includes(idUsuario)) {
        return prev.filter(id => id !== idUsuario);
      } else {
        return [...prev, idUsuario];
      }
    });
  };

  const handleEnviar = async () => {
    setSending(true);
    const success = await onEnviar(mensaje, adjuntos, destinatariosSeleccionados);
    if (success) {
      setMensaje('');
      setAdjuntos([]);
      setDestinatariosSeleccionados([]);
      onCancelar();
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex-shrink-0 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Redactar nuevo mensaje</h2>
        <p className="text-sm text-slate-600">Selecciona los destinatarios del expediente que recibirán el mensaje</p>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <div className="w-full max-w-none">
            {/* Adjuntos preview */}
            {adjuntos.length > 0 && (
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">Archivos adjuntos:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {adjuntos.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-300 shadow-sm">
                      <Paperclip className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-sm text-slate-700 truncate max-w-32">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors ml-1 p-0.5 rounded hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Selector de destinatarios */}
              <SelectorDestinatarios
                expediente={expediente}
                destinatariosSeleccionados={destinatariosSeleccionados}
                onToggleDestinatario={toggleDestinatario}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  rows={12}
                  className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  disabled={sending}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <footer className="bg-white/95 backdrop-blur-sm border-t border-slate-200 p-6 flex-shrink-0 shadow-lg">
          <div className="w-full flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              disabled={sending}
              title="Adjuntar archivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onCancelar}
                className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors font-semibold"
                disabled={sending}
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviar}
                disabled={sending || (!mensaje.trim() && adjuntos.length === 0) || destinatariosSeleccionados.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center space-x-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </footer>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};