import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearExpedienteRequest, CrearExpedienteResponse } from '../schemas/ExpedienteSchema';

export const crearExpediente = async (data: CrearExpedienteRequest): Promise<CrearExpedienteResponse> => {
  const response = await axiosWithoutMultipart.post<CrearExpedienteResponse>('expedientes', data);
  return response.data;
};