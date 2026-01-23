import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Mail } from 'lucide-react';
import { getAllParticipanteIds } from '../utils/chatUtils';
import { SelectorDestinatarios } from './SelectorDestinatarios';
import { enviarCredencialesDemandado, verificarPuedeEnviarCredenciales, obtenerDestinatariosCredenciales } from '../services/credencialesService';
import type { ExpedienteAsignado } from '../schemas/BandejaEntradaSchema';

interface FormularioNuevoMensajeProps {
  expediente: ExpedienteAsignado;
  onEnviar: (mensaje: string, adjuntos: File[], destinatarios: number[]) => Promise<boolean>;
  onCancelar: () => void;
  currentUser?: {
    id_usuario: number;
    id_rol: number;
    nombre: string;
  };
}

export const FormularioNuevoMensaje: React.FC<FormularioNuevoMensajeProps> = ({
  expediente,
  onEnviar,
  onCancelar,
  currentUser
}) => {
  // Función para obtener destinatarios iniciales según el rol del usuario
  const getDestinatariosIniciales = () => {
    if (!currentUser || !expediente?.participantes) return [];

    // Filtrar solo participantes activos
    const participantesExpediente = expediente.participantes?.filter((p: any) => 
      p?.usuario?.activo !== false
    ) || [];
    
    if (currentUser.id_rol === 1) {
      return participantesExpediente
        .filter((p: any) => p.usuario?.rol?.nombre === 'Administrador')
        .map((p: any) => p.usuario.id_usuario);
    } else if (currentUser.id_rol === 3) {
      return participantesExpediente
        .filter((p: any) => {
          const rol = p.usuario?.rol?.nombre;
          return rol === 'Secretario' || rol === 'Arbitro';
        })
        .map((p: any) => p.usuario.id_usuario);
    } else if (currentUser.id_rol === 4) {
      return participantesExpediente
        .filter((p: any) => {
          const rol = p.usuario?.rol?.nombre;
          return rol === 'Arbitro' || rol === 'Secretario';
        })
        .map((p: any) => p.usuario.id_usuario);
    }

    return getAllParticipanteIds(expediente);
  };

  const [mensaje, setMensaje] = useState('');
  const [adjuntos, setAdjuntos] = useState<File[]>([]);
  const [destinatariosSeleccionados, setDestinatariosSeleccionados] = useState<number[]>(
    getDestinatariosIniciales()
  );
  const [sending, setSending] = useState(false);

  // Estados para credenciales
  const [puedeEnviarCredenciales, setPuedeEnviarCredenciales] = useState(false);
  const [enviarCredencialesDemandados, setEnviarCredencialesDemandados] = useState(false);
  const [enviandoCredenciales, setEnviandoCredenciales] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    verificarCredenciales();
  }, [expediente.id, currentUser]);

  const verificarCredenciales = async () => {
    if (!expediente?.id || !currentUser) {
      return;
    }

    if (currentUser.id_rol !== 1 && currentUser.id_rol !== 2 && currentUser.id_rol !== 3) {
      return;
    }

    try {
      const response = await verificarPuedeEnviarCredenciales(expediente.id);
      setPuedeEnviarCredenciales(response.data.puede_enviar);
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
    }
  };

  const handleEnviarCredenciales = async (): Promise<number[]> => {
    if (!expediente?.id) return [];

    setEnviandoCredenciales(true);

    try {
      const response = await enviarCredencialesDemandado(expediente.id, mensaje, adjuntos);

      if (response.success) {
        setPuedeEnviarCredenciales(false);
        console.log('Credenciales enviadas exitosamente');
        return response.data?.ids_usuarios || [];
      } else {
        console.error('Error al enviar credenciales:', response.message);
        return [];
      }
    } catch (error: any) {
      console.error('Error al enviar credenciales:', error);
      return [];
    } finally {
      setEnviandoCredenciales(false);
    }
  };

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

  const toggleRol = (rol: string, seleccionar: boolean) => {
    const participantesValidos = getAllParticipanteIds(expediente);
    const participantesExpediente = expediente.participantes || [];

    const participantesDelRol = participantesExpediente
      .filter((p: any) => p.usuario?.rol?.nombre === rol)
      .map((p: any) => p.usuario.id_usuario);

    setDestinatariosSeleccionados(prev => {
      if (seleccionar) {
        const nuevos = participantesDelRol.filter((id: number) => !prev.includes(id));
        return [...prev, ...nuevos];
      } else {
        return prev.filter(id => !participantesDelRol.includes(id));
      }
    });
  };

  const handleEnviar = async () => {
    setSending(true);

    let destinatariosFinales = destinatariosSeleccionados;

    // Si el checkbox está marcado, primero obtener destinatarios y enviar credenciales
    if (enviarCredencialesDemandados && puedeEnviarCredenciales) {
      try {
        // 1. Obtener destinatarios correctos del backend
        const destinatariosResponse = await obtenerDestinatariosCredenciales(expediente.id);
        if (!destinatariosResponse.success) {
          console.error('Error al obtener destinatarios:', destinatariosResponse.message);
          setSending(false);
          return;
        }

        // 2. Enviar credenciales (esto ya incluye el mensaje y adjuntos)
        const idsUsuariosCreados = await handleEnviarCredenciales();
        if (idsUsuariosCreados.length === 0) {
          console.error('No se pudieron crear usuarios demandados');
          setSending(false);
          return;
        }

        console.log('Credenciales enviadas exitosamente con mensaje');
        
        // 3. NO enviar otro mensaje normal porque las credenciales ya incluyen el mensaje
        // Limpiar y cerrar directamente
        setMensaje('');
        setAdjuntos([]);
        setDestinatariosSeleccionados([]);
        setEnviarCredencialesDemandados(false);
        setSending(false);
        onCancelar();
        return;

      } catch (error) {
        console.error('Error en el proceso de credenciales:', error);
        setSending(false);
        return;
      }
    }

    // Enviar el mensaje normal solo si NO se enviaron credenciales
    if ((mensaje.trim() || adjuntos.length > 0) && destinatariosFinales.length > 0) {
      const success = await onEnviar(mensaje, adjuntos, destinatariosFinales);
      if (!success) {
        setSending(false);
        return;
      }
    }

    // Limpiar y cerrar
    setMensaje('');
    setAdjuntos([]);
    setDestinatariosSeleccionados([]);
    setEnviarCredencialesDemandados(false);
    setSending(false);
    onCancelar();
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex-shrink-0 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Redactar nuevo mensaje</h2>
        <p className="text-sm text-slate-600">Selecciona los destinatarios del expediente que recibirán el mensaje</p>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="w-full max-w-none space-y-6">
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
              {/* Checkbox para enviar credenciales - solo para admin, secretarios y árbitros */}
              {currentUser && (currentUser.id_rol === 1 || currentUser.id_rol === 2 || currentUser.id_rol === 3) && puedeEnviarCredenciales && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enviarCredencialesDemandados}
                      onChange={(e) => setEnviarCredencialesDemandados(e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      disabled={sending || enviandoCredenciales}
                    />
                    <span className="text-sm font-medium text-green-800">
                      Enviar credenciales a demandados
                    </span>
                    {enviandoCredenciales && (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </label>
                  <p className="text-xs text-green-700 mt-1 ml-7">
                    Se enviaran las credenciales de acceso por correo electrónico a todos los demandados
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  rows={8}
                  className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  disabled={sending}
                />
              </div>

              {/* Selector de destinatarios */}
              <SelectorDestinatarios
                expediente={expediente}
                destinatariosSeleccionados={destinatariosSeleccionados}
                onToggleDestinatario={toggleDestinatario}
                onToggleRol={toggleRol}
                currentUser={currentUser}
                deshabilitado={enviarCredencialesDemandados && puedeEnviarCredenciales}
                asunto={expediente.asunto}
              />


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
                disabled={sending || (
                  // Si está enviando credenciales, solo necesita el checkbox marcado (mensaje opcional)
                  enviarCredencialesDemandados && puedeEnviarCredenciales ?
                    false :
                    // Si no está enviando credenciales, necesita mensaje o adjuntos Y destinatarios
                    (!mensaje.trim() && adjuntos.length === 0) || destinatariosSeleccionados.length === 0
                )}
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