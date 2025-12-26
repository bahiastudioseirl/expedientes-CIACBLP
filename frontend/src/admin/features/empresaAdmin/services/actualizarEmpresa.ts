import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearEmpresaRequest, CrearEmpresaResponse } from '../schemas/EmpresaSchema';

export const actualizarEmpresa = async (
  id: number, 
  data: CrearEmpresaRequest
): Promise<CrearEmpresaResponse> => {
  const response = await axiosWithoutMultipart.patch<CrearEmpresaResponse>(`empresas/${id}`, data);
  return response.data;
};
