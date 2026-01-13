import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface AgregarArbitroRequest {
  nombre_arbitro: string;
  numero_documento: string;
  correo_arbitro: string;
  telefono_arbitro?: string;
}

export interface AgregarArbitroResponse {
  success: boolean;
  message: string;
  data: {
    usuario_existente: boolean;
    nombre_completo: string;
    correo: string;
    telefono: string | null;
    numero_documento: string;
  };
}

export const agregarArbitroExpediente = async (
  idExpediente: number,
  data: AgregarArbitroRequest
): Promise<AgregarArbitroResponse> => {
  const response = await axiosWithoutMultipart.post<AgregarArbitroResponse>(
    `/expedientes/${idExpediente}/arbitro`,
    data
  );
  return response.data;
};
