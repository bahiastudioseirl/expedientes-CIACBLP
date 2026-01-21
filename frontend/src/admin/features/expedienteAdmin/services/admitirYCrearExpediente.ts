import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface AdmitirYCrearExpedienteRequest {
  id_secretario_existente?: number;
  nombre_secretario?: string;
  correo_secretario?: string;
  telefono_secretario?: string;
}

export interface AdmitirYCrearExpedienteResponse {
  success: boolean;
  message: string;
  data: {
    expediente: {
      id_expediente: number;
      codigo_expediente: string;
      asunto: string;
      activo: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

export const crearExpedienteDesdeAdmitida = async (
  idSolicitud: number,
  data: AdmitirYCrearExpedienteRequest
): Promise<AdmitirYCrearExpedienteResponse> => {
  const response = await axiosWithoutMultipart.post<AdmitirYCrearExpedienteResponse>(
    `expedientes/${idSolicitud}/crear-expediente`,
    data
  );
  return response.data;
};
