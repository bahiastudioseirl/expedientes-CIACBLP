// =============================================
// INTERFACES PARA EXPEDIENTES
// =============================================

export interface DatosParte {
  nombre_razon: string;
  numero_documento: string;
  telefono: string;
  correos: string[];
}

export interface DatosUsuario {
  id: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
}

export interface Plantilla {
  id_plantilla: number | null;
  nombre: string | null;
}

export interface Expediente {
  id: number;
  codigo_expediente: string;
  id_solicitud: number;
  id_plantilla: number;
  activo: boolean;
  created_at: string;
  demandante: DatosParte[];
  demandado: DatosParte[];
  secretario: DatosUsuario | null;
  arbitro: DatosUsuario | null;
}

// =============================================
// RESPONSE INTERFACES
// =============================================

export interface ListarExpedientesResponse {
  success: boolean;
  message: string;
  data: {
    expedientes: Expediente[];
  };
}

// =============================================
// SOLICITUD - CREAR EXPEDIENTE
// =============================================

export interface DatosParteCorreo {
  principal: string;
  todos: Array<{
    correo: string;
    es_principal: boolean;
  }>;
}

export interface DatosParteSolicitud {
  nombre_razon: string;
  numero_documento: string;
  telefono: string;
  correos: DatosParteCorreo;
}

export interface DatosPartesExpediente {
  demandante: DatosParteSolicitud;
  demandado: DatosParteSolicitud;
}

export interface ExpedienteFormDataDesdeSolicitud {
  nombre_secretario: string;
  correo_secretario: string;
  telefono_secretario: string;
}

export interface CambiarEstadoExpedienteResponse {
  success: boolean;
  message: string;
  data: {
    expediente: Expediente;
  };
}
