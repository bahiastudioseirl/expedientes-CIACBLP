import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ExpedientesAsignadosResponse } from '../schemas/BandejaEntradaSchema';

export const obtenerExpedientesAsignados = async (): Promise<ExpedientesAsignadosResponse> => {
  const response = await axiosWithoutMultipart.get<ExpedientesAsignadosResponse>('/expedientes/asignados');
  return response.data;
};