import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface FinalizarExpedienteResponse {
    success: boolean;
    message: string;
}

export const finalizarExpediente = async (idExpediente: number): Promise<FinalizarExpedienteResponse> => {
    const response = await axiosWithoutMultipart.patch<FinalizarExpedienteResponse>(
        `expedientes/${idExpediente}/finalizar`
    );
    return response.data;
}