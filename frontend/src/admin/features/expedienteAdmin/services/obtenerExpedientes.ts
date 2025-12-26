import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ListarExpedientesResponse } from '../schemas/ExpedienteSchema';

export const obtenerExpedientes = async (): Promise<ListarExpedientesResponse> => {
  const response = await axiosWithoutMultipart.get<ListarExpedientesResponse>('expedientes');
  return response.data;
};