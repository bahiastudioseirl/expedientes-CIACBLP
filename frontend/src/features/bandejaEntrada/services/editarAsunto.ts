import { axiosWithoutMultipart } from "../../../api/axiosInstance";
import type { Asunto } from "../schemas/BandejaEntradaSchema";

interface EditarAsuntoRequest {
  id_expediente: number;
  titulo: string;
}

interface EditarAsuntoResponse {
  success: boolean;
  message: string;
  data: {
    asunto: Asunto;
  };
}

export const editarAsunto = async (idAsunto: number, request: EditarAsuntoRequest): Promise<EditarAsuntoResponse> => {
    const response = await axiosWithoutMultipart.patch<EditarAsuntoResponse>(`/asuntos/${idAsunto}`, request);
    return response.data;
};