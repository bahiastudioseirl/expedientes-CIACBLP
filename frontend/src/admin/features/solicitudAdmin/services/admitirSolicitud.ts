import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { AdmitirSolicitudResponse } from '../schemas/SolicitudSchema';

export const admitirSolicitud = async (id: number): Promise<AdmitirSolicitudResponse> => {
  try {
    const response = await axiosWithoutMultipart.post<AdmitirSolicitudResponse>(`solicitudes/${id}/admitir`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al admitir la solicitud ${id}`);
  }
};
