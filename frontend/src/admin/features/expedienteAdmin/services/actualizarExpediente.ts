import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { 
  ActualizarExpedienteRequest, 
  ActualizarExpedienteResponse, 
  CambiarEstadoExpedienteResponse 
} from '../schemas/ExpedienteSchema';

export const actualizarExpediente = async (
  id: number, 
  data: ActualizarExpedienteRequest
): Promise<ActualizarExpedienteResponse> => {
  const response = await axiosWithoutMultipart.patch<ActualizarExpedienteResponse>(`expedientes/${id}`, data);
  return response.data;
};

export const cambiarEstadoExpediente = async (id: number): Promise<CambiarEstadoExpedienteResponse> => {
  const response = await axiosWithoutMultipart.put<CambiarEstadoExpedienteResponse>(`expedientes/${id}/estado`);
  return response.data;
};