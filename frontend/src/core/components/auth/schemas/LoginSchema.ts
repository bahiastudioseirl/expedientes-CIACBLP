export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface User {
  id: number;
  nombre_completo: string;
  correo: string;
  rol: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    usuario: User;
  }

}
