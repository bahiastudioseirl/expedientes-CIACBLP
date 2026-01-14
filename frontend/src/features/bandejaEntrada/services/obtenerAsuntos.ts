import { axiosWithoutMultipart } from '../../../api/axiosInstance';
import type { AsuntosResponse } from '../schemas/BandejaEntradaSchema';

export const obtenerAsuntosPorExpediente = async (idExpediente: number | string): Promise<AsuntosResponse> => {
  const id = typeof idExpediente === 'string' ? parseInt(idExpediente, 10) : idExpediente;
  const response = await axiosWithoutMultipart.get<AsuntosResponse>(`/asuntos/expediente/${id}`);
  return response.data;
};