import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Expediente } from '../schemas/ExpedienteSchema';

export interface ObtenerExpedienteResponse {
  success: boolean;
  data: Expediente;
}

export const obtenerExpedientePorId = async (id: number): Promise<ObtenerExpedienteResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerExpedienteResponse>(`expedientes/${id}`);
  return response.data;
};
