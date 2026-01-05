export interface Usuario {
  id_usuario: number;
  numero_documento: string;
  nombre?: string;
  apellido?: string;
  nombre_empresa?: string;
  telefono: string;
  activo: boolean;
  id_rol: number;
  created_at: string;
  updated_at: string;
  rol: {
    id_rol: number;
    nombre: string;
    created_at: string;
    updated_at: string;
  };
  correos: Array<{
    id_correo: number;
    direccion: string;
  }>;
}

export interface ListarUsuariosResponse {
  success: boolean;
  message: string;
  data: {
    usuarios: Usuario[];
  };
}

export interface UsuarioResponse {
  success: boolean;
  message: string;
  data: {
    usuario: Usuario;
  };
}

export interface CambiarEstadoUsuarioResponse {
  success: boolean;
  message: string;
  data: {
    usuario: Usuario;
  };
}

// Request types para crear usuarios por tipo
export interface CrearUsuarioPersonaRequest {
  numero_documento: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correos: string[];
}

export interface CrearUsuarioEmpresaRequest {
  numero_documento: string;
  nombre_empresa: string;
  telefono: string;
  correos: string[];
}

// Request types para actualizar usuarios por tipo
export interface ActualizarUsuarioPersonaRequest {
  nombre: string;
  apellido: string;
  telefono: string;
  correos: string[];
}

export interface ActualizarUsuarioEmpresaRequest {
  nombre_empresa: string;
  telefono: string;
  correos: string[];
}

// Response para crear usuarios
export interface CrearUsuarioResponse {
  success: boolean;
  message: string;
  data: {
    usuario: Usuario;
  };
}

// Response para actualizar usuarios
export interface ActualizarUsuarioResponse {
  success: boolean;
  message: string;
  data: {
    usuario: Usuario;
  };
}