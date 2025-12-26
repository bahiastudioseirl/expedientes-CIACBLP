// =============================================
// INTERFACES BASE
// =============================================

export interface Usuario {
  id_usuario: number;
  numero_documento: string;
  nombre: string;
  apellido: string;
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
}

export interface UsuarioExpediente {
  numero_documento: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correos: string[];
}

export interface Plantilla {
  id_plantilla: number;
  nombre: string;
}

export interface Participante {
  rol: string;
  usuario: {
    id_usuario: number;
    numero_documento: string;
    nombre: string;
    apellido: string;
    telefono: string;
    correos: string[];
  };
}

export interface UsuarioInfo {
  usuario: Usuario;
  accion: "creado" | "actualizado";
  rol: string;
  contrasena_generada: string | null;
}

// =============================================
// REQUEST INTERFACES
// =============================================

export interface CrearExpedienteRequest {
  codigo_expediente: string;
  asunto: string;
  id_plantilla: number;
  demandante: UsuarioExpediente;
  demandado: UsuarioExpediente;
  secretario_arbitral: UsuarioExpediente;
  arbitro_a_cargo: UsuarioExpediente;
}

export interface ActualizarExpedienteRequest {
  codigo_expediente?: string;
  asunto?: string;
  id_plantilla?: number;
  demandante?: UsuarioExpediente;
  demandado?: UsuarioExpediente;
  secretario_arbitral?: UsuarioExpediente;
  arbitro_a_cargo?: UsuarioExpediente;
}

// =============================================
// RESPONSE INTERFACES
// =============================================

export interface Expediente {
  id_expediente: number;
  codigo_expediente: string;
  asunto: string;
  activo: boolean;
  plantilla: Plantilla;
  usuario_creador: {
    id_usuario: number;
    nombre: string;
    apellido: string;
  };
  participantes: Participante[];
  created_at: string;
  updated_at: string;
}

export interface CrearExpedienteResponse {
  success: boolean;
  message: string;
  data: {
    expediente: Expediente;
    usuarios_info: UsuarioInfo[];
  };
}

export interface ListarExpedientesResponse {
  success: boolean;
  message: string;
  data: {
    expedientes: Expediente[];
    total: number;
  };
}

export interface ObtenerExpedienteResponse {
  success: boolean;
  message: string;
  data: {
    expediente: Expediente;
  };
}

export interface ActualizarExpedienteResponse {
  success: boolean;
  message: string;
  data: {
    expediente: Expediente;
    usuarios_info: UsuarioInfo[];
  };
}

export interface CambiarEstadoExpedienteResponse {
  success: boolean;
  message: string;
  data: {
    expediente: Expediente;
  };
}

export interface VerificarUsuarioResponse {
  success: boolean;
  message: string;
  data: {
    usuario: {
      id_usuario: number;
      numero_documento: string;
      nombre: string;
      apellido: string;
      telefono: string;
      correos: string[];
    } | null;
    existe: boolean;
  };
}

// =============================================
// FORM INTERFACES
// =============================================

export interface FormParticipante {
  numero_documento: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correos: string[];
  // Estados para UI
  loading?: boolean;
  existe?: boolean;
  error?: string;
}

export interface ExpedienteFormData {
  codigo_expediente: string;
  asunto: string;
  id_plantilla: number;
  demandante: FormParticipante;
  demandado: FormParticipante;
  secretario_arbitral: FormParticipante;
  arbitro_a_cargo: FormParticipante;
}

// =============================================
// UTILITY TYPES
// =============================================

export type TipoParticipante = 'demandante' | 'demandado' | 'secretario_arbitral' | 'arbitro_a_cargo';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
