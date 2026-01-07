// =============================================
// INTERFACES PARA BANDEJA DE ENTRADA
// =============================================

export interface ExpedienteAsignado {
  id_expediente: number;
  codigo_expediente: string;
  asunto: string | null;
  activo: boolean;
  plantilla: {
    id_plantilla: number | null;
    nombre: string | null;
  };
  usuario_creador: {
    id_usuario: number | null;
    nombre: string | null;
    apellido: string | null;
  };
  participantes: Participante[];
  created_at: string | null;
  updated_at: string | null;
}

export interface Participante {
  usuario: {
    id_usuario: number;
    numero_documento: string;
    nombre_empresa?: string;
    nombre?: string;
    apellido?: string;
    id_rol: number | null;
    rol_nombre: string | null;
    telefono: string;
    correos: string[];
  };
}

export interface Asunto {
  id_asunto: number;
  id_expediente: number;
  titulo: string;
  activo: boolean;
  etapa?: {
    id_etapa: number;
    nombre: string;
  };
  sub_etapa?: {
    id_sub_etapa: number;
    nombre: string;
  };
}

export interface Mensaje {
  id_mensaje: number;
  contenido: string;
  fecha_envio: string;
  usuario_remitente: {
    id_usuario: number;
    nombre: string;
    apellido: string | null;
    numero_documento: string;
  };
  asunto: {
    id_asunto: number;
  };
  adjuntos: Adjunto[];
  created_at: string | null;
  updated_at: string | null;
}

export interface Adjunto {
  id_adjunto: number;
  ruta_archivo: string;
  nombre_archivo: string;
}

// =============================================
// REQUEST INTERFACES
// =============================================

export interface CrearMensajeRequest {
  id_asunto: number;
  contenido: string;
  usuarios_destinatarios: number[];
  adjuntos?: File[];
}

// =============================================
// RESPONSE INTERFACES
// =============================================

export interface ExpedientesAsignadosResponse {
  success: boolean;
  message: string;
  data: {
    expedientes: ExpedienteAsignado[];
  };
}

export interface AsuntosResponse {
  success: boolean;
  message: string;
  data: {
    asuntos: Asunto[];
  };
}

export interface MensajesResponse {
  success: boolean;
  message: string;
  data: {
    mensajes: Mensaje[];
  };
}

export interface CrearMensajeResponse {
  success: boolean;
  message: string;
  data: {
    mensaje: Mensaje;
  };
}

export interface CambiarEstadoAsuntoResponse {
  success: boolean;
  message: string;
  data: {
    asunto: Asunto | null;
  };
}

// =============================================
// BASE INTERFACES
// =============================================

export interface ApiResponse {
  success: boolean;
  message: string;
}

// =============================================
// UTILITY TYPES
// =============================================

export type RolUsuario = 'Administrador' | 'Árbitro a Cargo' | 'Secretario Arbitral' | 'Demandante' | 'Demandado';

export interface UsuarioActual {
  id_usuario: number;
  id_rol: number;
  rol_nombre: RolUsuario;
}