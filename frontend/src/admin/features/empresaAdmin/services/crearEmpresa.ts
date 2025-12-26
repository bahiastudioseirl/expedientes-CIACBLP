import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearEmpresaRequest, CrearEmpresaResponse } from '../schemas/EmpresaSchema';

export const crearEmpresa = async (data: CrearEmpresaRequest): Promise<CrearEmpresaResponse> => {
  const response = await axiosWithoutMultipart.post<CrearEmpresaResponse>('empresas', data);
  return response.data;
};
