// Interfaces simples para el módulo de solicitudes
export interface Correo {
  id: number;
  correo: string;
  es_principal: boolean;
}

export interface Representante {
  id: number;
  nombre_completo: string;
  numero_documento: string;
  telefono: string;
}

export interface DemandadoExtra {
  id: number;
  mesa_partes_virtual: boolean;
  direccion_fiscal: string | null;
}

export interface Parte {
  id: number;
  tipo: string; // 'demandante' | 'demandado'
  nombre_razon: string;
  numero_documento: string;
  telefono: string;
  direccion_fiscal: string | null;
  correos: Correo[];
  representantes: Representante[];
  demandado_extra?: DemandadoExtra;
}

export interface Pretension {
  id: number;
  descripcion: string;
  determinada: string; // 'determinada' | 'indeterminada'
  cuantia: number | null;
}

export interface DesignacionArbitral {
  id: number;
  arbitro_unico: boolean;
  propone_arbitro: number;
  encarga_ciacblp: number;
  arbitro: any;
}

export interface Solicitud {
  id: number;
  estado: string; // 'pendiente' | 'admitida' | 'rechazada'
  tiene_expediente: boolean;
  partes: Parte[];
  resumen_controversia: string;
  resumen_controversia_tipo: string; // 'texto' | 'archivo'
  resumen_controversia_archivo: string | null;
  pretensiones: Pretension[];
  medida_cautelar: string;
  designacion_arbitral: DesignacionArbitral;
  link_anexo: string;
  created_at: string;
  updated_at: string;
}

// Respuestas del API
export interface SolicitudResponse {
  success: boolean;
  message?: string;
  data: {
    solicitudes: Solicitud[];
  };
  meta?: {
    total: number;
  };
}

export interface SolicitudDetalleResponse {
  success: boolean;
  data: {
    solicitud: Solicitud;
  };
}

export interface AdmitirSolicitudResponse {
  success: boolean;
  message: string;
  data?: {
    solicitud: Solicitud;
  };
}