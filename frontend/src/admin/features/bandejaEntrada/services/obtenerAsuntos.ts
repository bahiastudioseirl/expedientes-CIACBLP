import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { AsuntosResponse } from '../schemas/BandejaEntradaSchema';

export const obtenerAsuntosPorExpediente = async (idExpediente: number): Promise<AsuntosResponse> => {
  const response = await axiosWithoutMultipart.get<AsuntosResponse>(`/asuntos/expediente/${idExpediente}`);
  return response.data;
};