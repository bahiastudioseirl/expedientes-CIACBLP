import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { SolicitudDetalleResponse } from '../schemas/SolicitudSchema';

export const obtenerSolicitudDetalle = async (id: number): Promise<SolicitudDetalleResponse> => {
  try {
    const response = await axiosWithoutMultipart.get<SolicitudDetalleResponse>(`solicitudes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener el detalle de la solicitud ${id}`);
  }
};