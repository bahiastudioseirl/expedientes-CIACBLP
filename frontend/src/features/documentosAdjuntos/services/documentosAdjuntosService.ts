import { axiosWithoutMultipart } from '../../../api/axiosInstance';
import type { DocumentosAdjuntosResponse, MisExpedientesResponse } from '../schemas/documentosAdjuntosSchema';

export const obtenerMisExpedientes = async (): Promise<MisExpedientesResponse> => {
  const response = await axiosWithoutMultipart.get<MisExpedientesResponse>('expedientes/mis-expedientes');
  return response.data;
};

export const obtenerAdjuntosPorExpediente = async (idExpediente: number): Promise<DocumentosAdjuntosResponse> => {
  const response = await axiosWithoutMultipart.get<DocumentosAdjuntosResponse>(`documentos/expediente/${idExpediente}/adjuntos`);
  return response.data;
};
