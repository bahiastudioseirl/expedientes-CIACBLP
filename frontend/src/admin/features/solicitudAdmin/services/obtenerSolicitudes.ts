import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { SolicitudResponse } from '../schemas/SolicitudSchema';

export const obtenerSolicitudes = async (): Promise<SolicitudResponse> => {
  try {
    const response = await axiosWithoutMultipart.get<SolicitudResponse>('solicitudes');
    return response.data;
  } catch (error: any) {
    // Si la respuesta es específicamente sobre no tener solicitudes, devolver respuesta vacía
    if (error.response?.data?.message === "No hay solicitudes registradas") {
      return {
        success: true,
        message: "No hay solicitudes registradas",
        data: { solicitudes: [] }
      };
    }
    throw new Error('Error al obtener las solicitudes');
  }
};
