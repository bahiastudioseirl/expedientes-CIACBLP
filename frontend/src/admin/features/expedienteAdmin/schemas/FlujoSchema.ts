// Tipos base
export interface Etapa {
  id_etapa: number;
  nombre: string;
  orden: number;
  subetapas: Subetapa[];
}

export interface Subetapa {
  id_sub_etapa: number;
  nombre: string;
  orden: number;
  dias_habiles: number;
  es_habil: boolean;
  es_obligatorio: boolean;
}

export interface FlujoExpediente {
  id_flujo: number;
  id_expediente: number;
  estado: 'en_proceso' | 'completado' | 'vencido';
  estado_calculado?: string;
  fecha_inicio: string;
  fecha_limite: string | null;
  fecha_fin: string | null;
  fecha_fin_estimada?: string;
  etapa: {
    id_etapa: number;
    nombre: string;
  } | null;
  subetapa: {
    id_sub_etapa: number;
    nombre: string;
  } | null;
}

// Request types
export interface CambiarEtapaExpedienteRequest {
  id_etapa: number;
  id_subetapa?: number;
}

export interface ActualizarFlujoExpedienteRequest {
  id_etapa: number;
  id_subetapa?: number;
}

// Response types
export interface FlujoActualResponse {
  success: boolean;
  message: string;
  data: {
    flujo: FlujoExpediente;
  };
}

export interface FlujosResponse {
  success: boolean;
  message: string;
  data: {
    flujos: FlujoExpediente[];
  };
}

export interface CambiarEtapaResponse {
  success: boolean;
  message: string;
  data: {
    flujo: FlujoExpediente;
  };
}

export interface ActualizarFlujoResponse {
  success: boolean;
  message: string;
  data: {
    flujo: FlujoExpediente;
  };
}

export interface EtapasPlantillaResponse {
  success: boolean;
  data: Etapa[];
}