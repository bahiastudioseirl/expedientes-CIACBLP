import { axiosWithoutMultipart } from '../../../api/axiosInstance';

export interface Participante {
    id_usuario_expediente: number;
    id_usuario: number;
    id_expediente: number;
    usuario: {
        id_usuario: number;
        nombre_completo: string;
        correo: string;
        telefono?: string;
        id_rol: number;
        rol: {
            id_rol: number;
            nombre: string;
        };
    };
}

export interface ParticipantesResponse {
    success: boolean;
    data: Participante[];
    message: string;
}

export const obtenerParticipantesExpediente = async (idExpediente: number): Promise<Participante[]> => {
    const response = await axiosWithoutMultipart.get<ParticipantesResponse>(`/expedientes/${idExpediente}/participantes`);
    return response.data.data;
};