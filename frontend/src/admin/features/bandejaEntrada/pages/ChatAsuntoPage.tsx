import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, Download, User, Clock, Lock, FileText, X } from 'lucide-react';
import { obtenerMensajesPorAsunto, crearMensaje, cambiarEstadoAsunto } from '../services/mensajesService';
import type { 
  Mensaje, 
  Asunto, 
  ExpedienteAsignado,
  CrearMensajeRequest 
} from '../schemas/BandejaEntradaSchema';

export default function ChatAsuntoPage() {
  const navigate = useNavigate();
  const { asuntoId } = useParams();
  const location = useLocation();
  
  // Obtener datos del state de navegación
  const { asunto, expediente, currentUser, userRole } = location.state || {};

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [adjuntos, setAdjuntos] = useState<File[]>([]);
  const [asuntoActual, setAsuntoActual] = useState(asunto);
  const [togglingAsunto, setTogglingAsunto] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!asunto || !expediente) {
      navigate('/administrator/bandeja-entrada');
      return;
    }
    cargarMensajes();
  }, [asuntoActual?.id_asunto, asunto, expediente, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const cargarMensajes = async () => {
    if (!asuntoActual) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await obtenerMensajesPorAsunto(asuntoActual.id_asunto);
      if (response.success) {
        setMensajes(response.data.mensajes);
      }
    } catch (err: any) {
      console.error('Error al cargar mensajes:', err);
      const msg = err?.response?.data?.message || 'Error al cargar los mensajes';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleAsunto = async () => {
    if (!asuntoActual) return;
    
    setTogglingAsunto(true);
    try {
      const response = await cambiarEstadoAsunto(asuntoActual.id_asunto);
      if (response.success && response.data.asunto) {
        setAsuntoActual(response.data.asunto);
      }
    } catch (err: any) {
      console.error('Error al cambiar estado del asunto:', err);
      const msg = err?.response?.data?.message || 'Error al cambiar el estado del asunto';
      setError(msg);
    } finally {
      setTogglingAsunto(false);
    }
  };

  const handleSendMessage = async () => {
    if (!mensaje.trim() && adjuntos.length === 0) return;
    if (!currentUser || !asuntoActual || !expediente) return;

    setSending(true);
    try {
      const destinatarios = expediente.participantes.map((p: any) => p.usuario.id_usuario);
      
      const messageData: CrearMensajeRequest = {
        id_asunto: asuntoActual.id_asunto,
        contenido: mensaje,
        usuarios_destinatarios: destinatarios,
        adjuntos: adjuntos.length > 0 ? adjuntos : undefined
      };

      const response = await crearMensaje(messageData);
      if (response.success) {
        setMensajes(prev => [...prev, response.data.mensaje]);
        setMensaje('');
        setAdjuntos([]);
      }
    } catch (err: any) {
      console.error('Error al enviar mensaje:', err);
      const msg = err?.response?.data?.message || 'Error al enviar el mensaje';
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdjuntos(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAdjuntos(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMyMessage = (mensaje: Mensaje) => {
    return currentUser && mensaje.usuario_remitente.id_usuario === currentUser.id_usuario;
  };

  const canManageAsunto = () => {
    return currentUser && [1, 2, 3].includes(currentUser.id_rol);
  };

  const handleGoBack = () => {
    navigate('/administrator/bandeja-entrada', {
      state: { selectedExpediente: expediente }
    });
  };

  if (!asunto || !expediente) {
    return null;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-sm text-slate-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-64 right-0 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header completamente fijo */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0 shadow-sm z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <button
              onClick={handleGoBack}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0 group"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                {asuntoActual.titulo}
              </h1>
              <p className="text-sm text-slate-600">
                {expediente.codigo_expediente} • {mensajes.length} mensaje{mensajes.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <span className={`px-4 py-2 text-xs font-semibold rounded-full border ${
              asuntoActual.activo 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {asuntoActual.activo ? 'Activo' : 'Cerrado'}
            </span>
            
            {canManageAsunto() && (
              <button
                onClick={handleToggleAsunto}
                disabled={togglingAsunto}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
                  asuntoActual.activo 
                    ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md'
                    : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md'
                }`}
                title={asuntoActual.activo ? 'Cerrar asunto' : 'Abrir asunto'}
              >
                {togglingAsunto ? 'Procesando...' : (asuntoActual.activo ? 'Cerrar' : 'Abrir')}
              </button>
            )}
          </div>
        </div>

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

      {/* Chat Messages - SOLO esta área tiene scroll */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {mensajes.length === 0 ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">¡Comienza la conversación!</h3>
                <p className="text-slate-600 leading-relaxed">
                  Sé el primero en enviar un mensaje en este asunto. Todos los participantes del expediente serán notificados.
                </p>
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 sm:px-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {mensajes.map((msg) => (
                  <div key={msg.id_mensaje} className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
                      isMyMessage(msg) ? 'order-2' : 'order-1'
                    }`}>
                      <div className={`rounded-2xl px-5 py-4 shadow-lg backdrop-blur-sm ${
                        isMyMessage(msg) 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                          : 'bg-white/90 border border-slate-200 text-slate-900'
                      }`}>
                        {!isMyMessage(msg) && (
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-7 h-7 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-slate-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700">
                              {msg.usuario_remitente.nombre}
                              {msg.usuario_remitente.apellido && ` ${msg.usuario_remitente.apellido}`}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {msg.contenido}
                        </p>

                        {msg.adjuntos.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {msg.adjuntos.map((adjunto) => (
                              <div key={adjunto.id_adjunto} className={`flex items-center justify-between p-3 rounded-xl ${
                                isMyMessage(msg) ? 'bg-blue-400/30' : 'bg-slate-50'
                              }`}>
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <Paperclip className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-xs font-medium truncate">{adjunto.nombre_archivo}</span>
                                </div>
                                <a
                                  href={adjunto.ruta_archivo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className={`flex items-center space-x-1 mt-3 text-xs ${
                          isMyMessage(msg) ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(msg.fecha_envio)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input completamente fijo abajo */}
      <footer className="bg-white/95 backdrop-blur-sm border-t border-slate-200 flex-shrink-0 shadow-lg z-20">
        {asuntoActual.activo ? (
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="max-w-4xl mx-auto">
              {/* Adjuntos preview */}
              {adjuntos.length > 0 && (
                <div className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
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

              {/* Input area */}
              <div className="flex items-end space-x-4 p-4 border border-slate-300 rounded-2xl bg-white shadow-lg">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                  disabled={sending}
                  title="Adjuntar archivo"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 min-w-0">
                  <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    rows={1}
                    className="w-full p-3 border-0 bg-transparent placeholder-slate-500 text-slate-900 resize-none focus:outline-none focus:ring-0 text-sm"
                    disabled={sending}
                    style={{ 
                      minHeight: '48px', 
                      maxHeight: '120px',
                      resize: 'none'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = '48px';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={sending || (!mensaje.trim() && adjuntos.length === 0)}
                  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105"
                  title="Enviar mensaje"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center p-5 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-sm">
                <Lock className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-sm text-red-800 font-semibold">
                  Este asunto está cerrado. No puedes enviar mensajes.
                </span>
              </div>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}