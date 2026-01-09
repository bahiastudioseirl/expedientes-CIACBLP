import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export const registrarSolicitante = async (data: {
  nombre_completo: string;
  numero_documento: string;
  correo: string;
}) => {
  const res = await axiosWithoutMultipart.post('/usuario-solicitante/registrar', data);
  return res.data;
};

export const verificarCodigo = async (data: { codigo: string }) => {
  const res = await axiosWithoutMultipart.post('/usuario-solicitante/verificar-codigo', data);
  return res.data;
};
