import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ObtenerExpedienteResponse } from '../schemas/ExpedienteSchema';

export const obtenerExpedientePorId = async (id: number): Promise<ObtenerExpedienteResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerExpedienteResponse>(`expedientes/${id}`);
  return response.data;
};