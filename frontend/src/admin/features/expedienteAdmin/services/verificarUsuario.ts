import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { VerificarUsuarioResponse } from '../schemas/ExpedienteSchema';

export const verificarUsuario = async (numeroDocumento: string): Promise<VerificarUsuarioResponse> => {
  const response = await axiosWithoutMultipart.get<VerificarUsuarioResponse>(`expedientes/verificar-usuario/${numeroDocumento}`);
  return response.data;
};