import { useState, useCallback } from 'react';
import { obtenerMensajesPorAsunto, crearMensaje, responderMensaje, obtenerHiloMensaje, cambiarEstadoAsunto } from '../services/mensajesService';
import type { Mensaje, Asunto, CrearMensajeRequest } from '../schemas/BandejaEntradaSchema';

interface UseChatMensajesProps {
  asunto: Asunto | null;
  currentUser: any;
  expediente: any;
}

export const useChatMensajes = ({ asunto, currentUser, expediente }: UseChatMensajesProps) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState<Mensaje | null>(null);
  const [hiloMensajes, setHiloMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHilo, setLoadingHilo] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [asuntoActual, setAsuntoActual] = useState(asunto);
  const [togglingAsunto, setTogglingAsunto] = useState(false);

  const cargarMensajes = useCallback(async () => {
    if (!asuntoActual) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await obtenerMensajesPorAsunto(asuntoActual.id_asunto);
      if (response.success) {
        const mensajesOrdenados = response.data.mensajes.sort((a: Mensaje, b: Mensaje) => 
          new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
        );
        setMensajes(mensajesOrdenados);
        if (mensajesOrdenados.length > 0 && !mensajeSeleccionado) {
          setMensajeSeleccionado(mensajesOrdenados[0]);
        }
      }
    } catch (err: any) {
      console.error('Error al cargar mensajes:', err);
      const msg = err?.response?.data?.message || 'Error al cargar los mensajes';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [asuntoActual]); 

  const seleccionarMensaje = useCallback(async (mensaje: Mensaje) => {
    setMensajeSeleccionado(mensaje);
    setLoadingHilo(true);
    
    try {
      const hiloResponse = await obtenerHiloMensaje(mensaje.id_mensaje);
      if (hiloResponse.success) {
        setHiloMensajes(hiloResponse.data);
      } else {
        setHiloMensajes([mensaje]);
      }
    } catch (error) {
      console.error('Error al cargar hilo:', error);
      setHiloMensajes([mensaje]);
    } finally {
      setLoadingHilo(false);
    }
  }, []);

  const enviarMensaje = useCallback(async (
    mensaje: string, 
    adjuntos: File[], 
    destinatariosSeleccionados: number[],
    respondiendoMensaje?: number | null
  ) => {
    if (!mensaje.trim() && adjuntos.length === 0) return false;
    if (!currentUser || !asuntoActual || !expediente) return false;
    if (destinatariosSeleccionados.length === 0) {
      setError('Debes seleccionar al menos un destinatario');
      return false;
    }

    setSending(true);
    try {
      const messageData: CrearMensajeRequest = {
        id_asunto: asuntoActual.id_asunto,
        contenido: mensaje,
        usuarios_destinatarios: destinatariosSeleccionados,
        adjuntos: adjuntos.length > 0 ? adjuntos : undefined
      };

      let response;
      
      if (respondiendoMensaje) {
        response = await responderMensaje(respondiendoMensaje, messageData);
      } else {
        response = await crearMensaje(messageData);
      }

      if (response.success) {
        if (respondiendoMensaje) {
          // Si es una respuesta, NO agregar a la lista principal
          // En su lugar, actualizar el hilo si el mensaje padre está seleccionado
          if (mensajeSeleccionado && mensajeSeleccionado.id_mensaje === respondiendoMensaje) {
            setHiloMensajes(prev => [...prev, response.data.mensaje]);
          }
          // Recargar la lista de mensajes para actualizar los contadores de respuestas
          cargarMensajes();
        } else {
          // Si es un mensaje nuevo, agregarlo a la lista principal
          setMensajes(prev => [...prev, response.data.mensaje]);
          // Seleccionar el mensaje recién creado
          setMensajeSeleccionado(response.data.mensaje);
          setHiloMensajes([response.data.mensaje]);
        }
        
        return true; // Indica éxito
      }
    } catch (err: any) {
      console.error('Error al enviar mensaje:', err);
      const msg = err?.response?.data?.message || 'Error al enviar el mensaje';
      setError(msg);
    } finally {
      setSending(false);
    }
    return false;
  }, [currentUser, asuntoActual, expediente, mensajeSeleccionado, cargarMensajes]);

  const cambiarEstadoAsuntoActual = useCallback(async () => {
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
  }, [asuntoActual]);

  const limpiarError = useCallback(() => {
    setError('');
  }, []);

  return {
    // State
    mensajes,
    mensajeSeleccionado,
    hiloMensajes,
    loading,
    loadingHilo,
    sending,
    error,
    asuntoActual,
    togglingAsunto,
    
    // Actions
    cargarMensajes,
    seleccionarMensaje,
    enviarMensaje,
    cambiarEstadoAsuntoActual,
    limpiarError,
    
    // Setters para casos específicos
    setMensajeSeleccionado,
    setHiloMensajes
  };
};