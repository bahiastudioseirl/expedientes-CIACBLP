import { axiosWithoutMultipart } from '../../../api/axiosInstance';
import type { Asunto } from '../schemas/BandejaEntradaSchema';

interface CrearAsuntoRequest {
  id_expediente: number;
  titulo: string;
}

interface CrearAsuntoResponse {
  success: boolean;
  message: string;
  data: {
    asunto: Asunto;
  };
}

export const crearAsunto = async (request: CrearAsuntoRequest): Promise<CrearAsuntoResponse> => {
  const response = await axiosWithoutMultipart.post<CrearAsuntoResponse>('/asuntos', request);
  return response.data;
};