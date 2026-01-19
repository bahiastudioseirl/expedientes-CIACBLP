import { axiosWithoutMultipart, axiosInstance } from '../../../api/axiosInstance';

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

export interface DestinatariosCredencialesResponse {
    success: boolean;
    data: {
        staff_ids: number[];
        correos_demandados: string[];
        total_destinatarios: number;
    };
    message: string;
}

export const enviarCredencialesDemandado = async (idExpediente: number, mensaje: string = '', adjuntos: File[] = []): Promise<CredencialesResponse> => {
    const formData = new FormData();
    formData.append('mensaje', mensaje);
    
    // Agregar adjuntos si existen
    if (adjuntos && adjuntos.length > 0) {
        adjuntos.forEach((archivo, index) => {
            formData.append(`adjuntos[${index}]`, archivo);
        });
    }
    
    const response = await axiosInstance.post(`/credenciales/expediente/${idExpediente}/enviar-demandado`, formData);
    return response.data;
};

export const verificarPuedeEnviarCredenciales = async (idExpediente: number): Promise<VerificarCredencialesResponse> => {
    const response = await axiosWithoutMultipart.get(`/credenciales/expediente/${idExpediente}/puede-enviar`);
    return response.data;
};

export const obtenerDestinatariosCredenciales = async (idExpediente: number): Promise<DestinatariosCredencialesResponse> => {
    const response = await axiosWithoutMultipart.get(`/credenciales/expediente/${idExpediente}/destinatarios`);
    return response.data;
};