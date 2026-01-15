/* =========================
   REQUEST
========================= */

export interface CrearPlantillaRequest {
  nombre: string;
  etapas: {
    nombre: string;
    orden: number;
    sub_etapas: {
      nombre?: string;
      descripcion?: string;
      orden: number;
      dias_habiles: number;
      es_habil: boolean;
      es_obligatorio: boolean;
    }[];
  }[];
}

export interface ActualizarPlantillaRequest {
  nombre: string;
  etapas: {
    id_etapa?: number;
    nombre: string;
    orden: number;
    sub_etapas: {
      id_sub_etapa?: number;
      nombre?: string;
      orden: number;
      dias_habiles: number;
      es_habil: boolean;
      es_obligatorio: boolean;
    }[];
  }[];
}

/* =========================
   RESPONSE
========================= */

export interface SubEtapa {
  id_sub_etapa: number;
  nombre: string;
  descripcion?: string;
  orden: number;
  dias_habiles: number;
  es_habil: boolean;
  es_obligatorio: boolean;
  created_at: string;
  updated_at: string;
}

export interface Etapa {
  id_etapa: number;
  nombre: string;
  orden: number;
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
