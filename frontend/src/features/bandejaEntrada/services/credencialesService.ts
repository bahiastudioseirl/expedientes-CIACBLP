import { axiosWithoutMultipart } from '../../../api/axiosInstance';

export interface CredencialesResponse {
    success: boolean;
    message: string;
    data?: {
        usuarios_creados: number;
        correos_enviados: string[];
        ids_usuarios: number[];
    };
}

export interface VerificarCredencialesResponse {
    success: boolean;
    data: {
        puede_enviar: boolean;
    };
    message: string;
}

export const enviarCredencialesDemandado = async (idExpediente: number, mensaje?: string): Promise<CredencialesResponse> => {
    const response = await axiosWithoutMultipart.post(`/credenciales/expediente/${idExpediente}/enviar-demandado`, {
        mensaje: mensaje || ''
    });
    return response.data;
};

export const verificarPuedeEnviarCredenciales = async (idExpediente: number): Promise<VerificarCredencialesResponse> => {
    const response = await axiosWithoutMultipart.get(`/credenciales/expediente/${idExpediente}/puede-enviar`);
    return response.data;
};