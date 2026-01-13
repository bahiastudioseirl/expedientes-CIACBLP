import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface AdmitirSolicitudResponse {
  success: boolean;
  message: string;
}

export const admitirSolicitud = async (
  idSolicitud: number
): Promise<AdmitirSolicitudResponse> => {
  const response = await axiosWithoutMultipart.put<AdmitirSolicitudResponse>(
    `solicitudes/${idSolicitud}/admitir`
  );
  return response.data;
};
