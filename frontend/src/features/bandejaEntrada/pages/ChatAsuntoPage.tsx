import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useChatMensajes } from '../hooks/useChatMensajes';
import { getAllParticipanteIds, getValidParticipantes } from '../utils/chatUtils';
import { PanelListaMensajes } from '../components/PanelListaMensajes';
import { PanelDetalleMensaje } from '../components/PanelDetalleMensaje';
import { FormularioNuevoMensaje } from '../components/FormularioNuevoMensaje';
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

  // Estados locales para UI - mostrar formulario por defecto
  const [mostrandoFormularioNuevo, setMostrandoFormularioNuevo] = useState(true);
  const [respondiendoMensaje, setRespondiendoMensaje] = useState<number | null>(null);

  // Hook personalizado para manejo de mensajes
  const {
    mensajes,
    mensajeSeleccionado,
    hiloMensajes,
    loading,
    loadingHilo,
    sending,
    error,
    asuntoActual,
    togglingAsunto,
    cargarMensajes,
    seleccionarMensaje,
    enviarMensaje,
    cambiarEstadoAsuntoActual,
    limpiarError,
    setMensajeSeleccionado,
    setHiloMensajes
  } = useChatMensajes({ asunto, currentUser, expediente });

  useEffect(() => {
    if (!asunto || !expediente) {
      navigate('/bandeja-entrada');
      return;
    }
    cargarMensajes();
  }, [asuntoActual?.id_asunto, asunto, expediente, navigate, cargarMensajes]);

  const handleGoBack = () => {
    navigate('/bandeja-entrada', {
      state: { selectedExpediente: expediente }
    });
  };

  const handleNuevoMensaje = () => {
    // Alternar entre mostrar formulario y ocultarlo
    setMostrandoFormularioNuevo(!mostrandoFormularioNuevo);
    // Limpiar selección cuando se abre el formulario
    if (!mostrandoFormularioNuevo) {
      setMensajeSeleccionado(null);
      setRespondiendoMensaje(null);
      setHiloMensajes([]);
    }
  };

  const handleResponderMensaje = (idMensaje: number) => {
    setRespondiendoMensaje(idMensaje);
    setMostrandoFormularioNuevo(false);
  };

  const handleCancelarFormulario = () => {
    setMostrandoFormularioNuevo(false);
    setRespondiendoMensaje(null);
  };

  const handleEnviarMensaje = async (
    mensaje: string, 
    adjuntos: File[], 
    destinatarios: number[]
  ): Promise<boolean> => {
    const success = await enviarMensaje(mensaje, adjuntos, destinatarios);
    if (success) {
      setMostrandoFormularioNuevo(false);
    }
    return success;
  };

  const handleEnviarRespuesta = async (
    mensaje: string, 
    adjuntos: File[], 
    destinatarios: number[]
  ): Promise<boolean> => {
    const success = await enviarMensaje(mensaje, adjuntos, destinatarios, respondiendoMensaje);
    if (success) {
      setRespondiendoMensaje(null);
    }
    return success;
  };

  const handleSeleccionarMensaje = (mensaje: Mensaje) => {
    seleccionarMensaje(mensaje);
    setMostrandoFormularioNuevo(false);
    setRespondiendoMensaje(null);
  };

  // Validaciones tempranas
  if (!asunto || !expediente) {
    return null;
  }

  // Validación adicional para asegurar que hay participantes
  if (getValidParticipantes(expediente).length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-sm text-slate-600">No hay participantes en este expediente.</p>
        </div>
      </div>
    );
  }

  // Solo mostrar loading si realmente está cargando mensajes
  if (loading && mensajes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-xs text-slate-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-64 right-0 flex bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Panel izquierdo - Lista de mensajes */}
      <PanelListaMensajes
        asunto={asuntoActual}
        expediente={expediente}
        mensajes={mensajes}
        mensajeSeleccionado={mensajeSeleccionado}
        loading={loading}
        error={error}
        onGoBack={handleGoBack}
        onNuevoMensaje={handleNuevoMensaje}
        onSeleccionarMensaje={handleSeleccionarMensaje}
      />

      {/* Panel derecho - Detalle del mensaje o formulario */}
      <div className="flex-1 flex flex-col">
        {mostrandoFormularioNuevo ? (
          <FormularioNuevoMensaje
            expediente={expediente}
            onEnviar={handleEnviarMensaje}
            onCancelar={handleCancelarFormulario}
          />
        ) : mensajeSeleccionado ? (
          <PanelDetalleMensaje
            asunto={asuntoActual}
            expediente={expediente}
            mensajeSeleccionado={mensajeSeleccionado}
            hiloMensajes={hiloMensajes}
            loadingHilo={loadingHilo}
            respondiendoMensaje={respondiendoMensaje}
            onResponderMensaje={handleResponderMensaje}
            onCancelarRespuesta={() => setRespondiendoMensaje(null)}
            onEnviarRespuesta={handleEnviarRespuesta}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Revisa aquí tus chats</h3>
              <p className="text-sm text-slate-500">Selecciona un mensaje de la izquierda para ver la conversación completa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}