import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Reply } from 'lucide-react';
import { getAllParticipanteIds } from '../utils/chatUtils';
import { SelectorDestinatarios } from './SelectorDestinatarios';
import type { ExpedienteAsignado } from '../schemas/BandejaEntradaSchema';

interface FormularioRespuestaProps {
  expediente: ExpedienteAsignado;
  onEnviar: (mensaje: string, adjuntos: File[], destinatarios: number[]) => Promise<boolean>;
  onCancelar: () => void;
}

export const FormularioRespuesta: React.FC<FormularioRespuestaProps> = ({
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
    }
    setSending(false);
  };

  return (
    <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <Reply className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-900">Responder mensaje</h3>
      </div>

      {/* Adjuntos preview para respuesta */}
      {adjuntos.length > 0 && (
        <div className="mb-4 p-4 bg-white rounded-xl border border-blue-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">Archivos adjuntos:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {adjuntos.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-300">
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
        {/* Selector de destinatarios para respuesta */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Destinatarios ({destinatariosSeleccionados.length}/{expediente?.participantes?.length || 0})
          </label>
          {destinatariosSeleccionados.length === 0 && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                ⚠️ Debes seleccionar al menos un destinatario para enviar la respuesta.
              </p>
            </div>
          )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-xl border border-blue-300">
          <SelectorDestinatarios
            expediente={expediente}
            destinatariosSeleccionados={destinatariosSeleccionados}
            onToggleDestinatario={toggleDestinatario}
            variant="response"
          />
        </div>
        </div>

        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu respuesta..."
          rows={6}
          className="w-full p-4 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm bg-white"
          disabled={sending}
        />

        <div className="flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-500 hover:text-slate-700 hover:bg-white rounded-xl transition-colors"
            disabled={sending}
            title="Adjuntar archivo"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onCancelar}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-colors font-semibold"
              disabled={sending}
            >
              Cancelar
            </button>
            <button
              onClick={handleEnviar}
              disabled={sending || (!mensaje.trim() && adjuntos.length === 0) || destinatariosSeleccionados.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold flex items-center space-x-2"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Respondiendo...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Responder</span>
                </>
              )}
            </button>
          </div>
        </div>
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