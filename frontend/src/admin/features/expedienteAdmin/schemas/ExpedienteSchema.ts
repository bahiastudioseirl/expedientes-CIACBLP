// =============================================
// INTERFACES BASE
// =============================================

export interface Usuario {
  id_usuario: number;
  numero_documento: string;
  // Para Demandante y Demandado:
  nombre_empresa?: string;
  // Para otros roles:
  nombre?: string;
  apellido?: string;
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
  // Para Demandante y Demandado:
  nombre_empresa?: string;
  // Para otros roles:
  nombre?: string;
  apellido?: string;
  telefono: string;
  correos: string[];
}

export interface Plantilla {
  id_plantilla: number | null;
  nombre: string | null;
}

export interface Participante {
  usuario: {
    id_usuario: number;
    numero_documento: string;
    // Para Demandante y Demandado:
    nombre_empresa?: string;
    // Para otros roles:
    nombre?: string;
    apellido?: string;
    id_rol: number | null;
    rol_nombre: string | null;
    telefono: string;
    correos: string[];
  };
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
  codigo_expediente: string;
  asunto: string;
  id_plantilla: number;
  demandante: UsuarioExpediente;
  demandado: UsuarioExpediente;
  secretario_arbitral: UsuarioExpediente;
  arbitro_a_cargo: UsuarioExpediente;
}

// =============================================
// RESPONSE INTERFACES
// =============================================

export interface Expediente {
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

export interface CrearExpedienteResponse {
  success: boolean;
  message: string;
  data: {
    expediente: Expediente;
  };
}

export interface ListarExpedientesResponse {
  success: boolean;
  message: string;
  data: {
    expedientes: Expediente[];
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
      // Para Demandante y Demandado:
      nombre_empresa?: string;
      // Para otros roles:
      nombre?: string;
      apellido?: string;
      telefono: string;
      correos: string[];
      rol?: string;
      tipo: 'usuario_sistema' | 'arbitro'; // Nuevo campo para identificar el tipo
    } | null;
    existe: boolean;
  };
}

// =============================================
// FORM INTERFACES
// =============================================

export interface FormParticipante {
  numero_documento: string;
  // Para Demandante y Demandado:
  nombre_empresa?: string;
  // Para otros roles:
  nombre?: string;
  apellido?: string;
  telefono: string;
  correos: string[];
  // Estados para UI
  loading?: boolean;
  existe?: boolean;
  error?: string;
  // Información adicional del usuario encontrado
  usuarioTipo?: 'usuario_sistema' | 'arbitro';
  usuarioRol?: string;
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
