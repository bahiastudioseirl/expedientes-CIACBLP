import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { LoginRequest, LoginResponse } from '../schemas/LoginSchema';

export const iniciarSesion = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosWithoutMultipart.post<LoginResponse>('auth/login', credentials);
  return response.data;
};
