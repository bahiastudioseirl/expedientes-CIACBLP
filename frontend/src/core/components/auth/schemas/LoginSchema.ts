export interface LoginRequest {
  numero_documento: string;
  contrasena: string;
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  numero_documento: string;
  rol: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
