import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { SolicitudResponse } from '../schemas/SolicitudSchema';

export const obtenerSolicitudes = async (): Promise<SolicitudResponse> => {
  try {
    const response = await axiosWithoutMultipart.get<SolicitudResponse>('solicitudes');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener las solicitudes');
  }
};
