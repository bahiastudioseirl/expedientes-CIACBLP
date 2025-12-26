import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Empresa } from '../schemas/EmpresaSchema';

export interface ObtenerEmpresasResponse {
  message: string;
  data: Empresa[]; 
}

export const obtenerEmpresas = async (): Promise<ObtenerEmpresasResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerEmpresasResponse>('empresas');
  return response.data;
};
