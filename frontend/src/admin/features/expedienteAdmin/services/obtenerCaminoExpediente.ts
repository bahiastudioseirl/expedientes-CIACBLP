import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CaminoExpedienteResponse } from '../schemas/CaminoExpedienteSchema';

export const obtenerCaminoExpediente = async (idExpediente: number): Promise<CaminoExpedienteResponse> => {
  const response = await axiosWithoutMultipart.get<CaminoExpedienteResponse>(`flujo/expediente/${idExpediente}/camino`);
  return response.data;
};