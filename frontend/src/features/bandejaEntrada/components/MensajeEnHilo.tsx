import React from 'react';
import { User, Reply, Download, Paperclip } from 'lucide-react';
import { obtenerNombreCompleto, formatTime } from '../utils/chatUtils';
import type { Mensaje } from '../schemas/BandejaEntradaSchema';

interface MensajeEnHiloProps {
  mensaje: Mensaje;
  isOriginal: boolean;
  asuntoActivo: boolean;
  onResponder?: () => void;
}

export const MensajeEnHilo: React.FC<MensajeEnHiloProps> = ({
  mensaje,
  isOriginal,
  asuntoActivo,
  onResponder
}) => {
  // Fix temporal: usar usuario_remitente o usuario como fallback
  const usuarioParaMostrar = mensaje.usuario_remitente || mensaje.usuario;
  
  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 w-full">
      <div className="flex items-start space-x-6 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-slate-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-base font-semibold text-slate-900 mb-1">
                {obtenerNombreCompleto(usuarioParaMostrar)}
              </h4>
              <p className="text-sm text-slate-500">
                {formatTime(mensaje.fecha_envio)} {isOriginal ? '(Mensaje original)' : '(Respuesta)'}
              </p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
              {mensaje.contenido}
            </p>
          </div>

          {/* Adjuntos */}
          {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h5 className="text-xs font-semibold text-slate-700 mb-3">Archivos adjuntos:</h5>
              <div className="space-y-2">
                {mensaje.adjuntos.map((adjunto: any) => (
                  <div key={adjunto.id_adjunto} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Paperclip className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {adjunto.nombre_archivo || 'Archivo sin nombre'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(adjunto.ruta_archivo)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};