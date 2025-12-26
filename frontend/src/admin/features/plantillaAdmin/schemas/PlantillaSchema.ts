/* =========================
   REQUEST
========================= */

export interface CrearPlantillaRequest {
  nombre: string;
  etapas: {
    nombre: string;
    sub_etapas: {
      nombre?: string;
      tiene_tiempo: boolean;
      duracion_dias: number | null;
      es_opcional: boolean;
    }[];
  }[];
}

export interface ActualizarPlantillaRequest {
  nombre: string;
  etapas: {
    nombre: string;
    sub_etapas: {
      nombre?: string;
      tiene_tiempo: boolean;
      duracion_dias: number | null;
      es_opcional: boolean;
    }[];
  }[];
}

/* =========================
   RESPONSE
========================= */

export interface SubEtapa {
  id_sub_etapa: number;
  nombre: string;
  tiene_tiempo: boolean;
  duracion_dias: number | null;
  es_opcional: boolean;
  created_at: string;
  updated_at: string;
}

export interface Etapa {
  id_etapa: number;
  nombre: string;
  sub_etapas: SubEtapa[];
}

export interface Plantilla {
  id_plantilla: number;
  nombre: string;
  activo: boolean;
  etapas: Etapa[];
  created_at: string;
  updated_at: string;
}

export interface PlantillaCreateData {
  plantilla: Plantilla;
}

export interface CrearPlantillaResponse {
  success: boolean;
  message: string;
  data: PlantillaCreateData;
}

export interface ListarPlantillasResponse {
  success: boolean;
  data: {
    plantillas: Plantilla[];
  };
}

export interface CambiarEstadoResponse {
  success: boolean;
  message: string;
  data: {
    plantilla: Plantilla;
  };
}
