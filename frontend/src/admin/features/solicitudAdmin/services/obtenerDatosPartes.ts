import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface DatosParteResponse {
  success: boolean;
  data: {
    demandante: {
      nombre_razon: string;
      numero_documento: string;
      correos: {
        principal: string;
        todos: Array<{
          correo: string;
          es_principal: boolean;
        }>;
      };
      telefono: string;
    };
    demandado: {
      nombre_razon: string;
      numero_documento: string;
      correos: {
        principal: string;
        todos: Array<{
          correo: string;
          es_principal: boolean;
        }>;
      };
      telefono: string;
    };
  };
}

export const obtenerDatosPartes = async (idSolicitud: number): Promise<DatosParteResponse> => {
  const response = await axiosWithoutMultipart.get<DatosParteResponse>(
    `solicitudes/${idSolicitud}/datos-partes`
  );
  return response.data;
};
