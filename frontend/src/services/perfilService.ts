import { axiosWithoutMultipart } from '../api/axiosInstance';
import type { User } from '../core/components/auth/schemas/LoginSchema';

export interface ActualizarPerfilRequest {
  nombre_completo: string;
}

export interface ActualizarPerfilResponse {
  success: boolean;
  message: string;
  data?: {
    usuario: User;
  };
}

export const actualizarPerfil = async (datos: ActualizarPerfilRequest): Promise<ActualizarPerfilResponse> => {
  const response = await axiosWithoutMultipart.put<ActualizarPerfilResponse>(
    'perfil/actualizar',
    datos
  );
  return response.data;
};