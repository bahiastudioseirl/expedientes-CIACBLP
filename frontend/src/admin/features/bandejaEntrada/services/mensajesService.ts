import { axiosWithoutMultipart, axiosInstance } from '../../../../api/axiosInstance';
import type { 
  MensajesResponse, 
  CrearMensajeRequest, 
  CrearMensajeResponse,
  CambiarEstadoAsuntoResponse
} from '../schemas/BandejaEntradaSchema';

export const obtenerMensajesPorAsunto = async (idAsunto: number): Promise<MensajesResponse> => {
  const response = await axiosWithoutMultipart.get<MensajesResponse>(`/mensajes/asunto/${idAsunto}`);
  return response.data;
};

export const crearMensaje = async (data: CrearMensajeRequest): Promise<CrearMensajeResponse> => {
  const formData = new FormData();
  formData.append('id_asunto', data.id_asunto.toString());
  formData.append('contenido', data.contenido);
  
  // Agregar usuarios destinatarios como array
  data.usuarios_destinatarios.forEach((id, index) => {
    formData.append(`usuarios_destinatarios[${index}]`, id.toString());
  });
  
  // Agregar adjuntos si existen
  if (data.adjuntos && data.adjuntos.length > 0) {
    data.adjuntos.forEach((file, index) => {
      formData.append(`adjuntos[${index}]`, file);
    });
  }
  
  const response = await axiosInstance.post<CrearMensajeResponse>('/mensajes', formData);
  return response.data;
};

export const cambiarEstadoAsunto = async (idAsunto: number): Promise<CambiarEstadoAsuntoResponse> => {
  const response = await axiosWithoutMultipart.put<CambiarEstadoAsuntoResponse>(`/asuntos/${idAsunto}/mensajear`);
  return response.data;
};