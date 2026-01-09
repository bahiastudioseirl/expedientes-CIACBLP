import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import { RegistroSolicitudRequest } from '../schemas/RegistroSolicitudSchema';

export const registrarSolicitud = async (data: RegistroSolicitudRequest) => {
  const res = await axiosWithoutMultipart.post('/solicitud/registrar', data);
  return res.data;
};
