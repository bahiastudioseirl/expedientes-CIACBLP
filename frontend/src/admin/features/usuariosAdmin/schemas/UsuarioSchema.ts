export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  numero_documento: string;
  correo: string;
  telefono: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  rol: {
    id_rol: number;
    nombre: string;
    created_at: string;
    updated_at: string;
  };
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

// Interfaces para gestión de participantes en expedientes
export interface Expediente {
  id: number;
  codigo_expediente: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ListarExpedientesResponse {
  success: boolean;
  message: string;
  data: {
    expedientes: Expediente[];
  };
}

export interface ParticipanteExpediente {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  activo: boolean;
  rol: {
    id_rol: number;
    nombre: string;
  };
}

export interface ParticipantesExpedienteResponse {
  success: boolean;
  message: string;
  data: {
    demandantes: ParticipanteExpediente[];
    demandados: ParticipanteExpediente[];
    total: number;
  };
}

export interface AgregarParticipanteRequest {
  correo: string;
  tipo: 'demandante' | 'demandado';
}

export interface AgregarParticipanteResponse {
  success: boolean;
  message: string;
  data: {
    usuario_creado: any;
    correo_agregado: string;
    tipo_parte: string;
    solicitud_parte_id: number;
  };
}

// Request types para crear usuarios por tipo
export interface CrearUsuarioRequest {
  nombre_completo: string;
  correo: string;
  telefono: string;
}

// Request types para actualizar usuarios por tipo
export interface ActualizarUsuarioRequest {
  nombre_completo?: string;
  correo?: string;
  telefono?: string;
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