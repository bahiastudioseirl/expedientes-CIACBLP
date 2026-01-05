import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface FlujoExpediente {
  id_flujo: number;
  id_expediente: number;
  id_etapa: number;
  id_subetapa?: number;
  estado: 'en proceso' | 'completado' | 'por vencer' | 'vencido';
  estado_calculado?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  fecha_fin_estimada?: string;
  expediente?: {
    id_expediente: number;
    codigo_expediente: string;
  };
  etapa?: {
    id_etapa: number;
    nombre: string;
  };
  subetapa?: {
    id_sub_etapa: number;
    nombre: string;
  };
}

export interface Etapa {
  id_etapa: number;
  nombre: string;
  subetapas?: Subetapa[];
}

export interface Subetapa {
  id_sub_etapa: number;
  nombre: string;
}

export interface PlantillaEtapas {
  id_plantilla: number;
  nombre: string;
  etapas: Etapa[];
}

export interface CambiarEtapaExpedienteRequest {
  id_expediente: number;
  id_etapa: number;
  id_subetapa?: number;
  asunto: string;
}

export interface ActualizarFlujoExpedienteRequest {
  id_etapa: number;
  id_subetapa?: number;
  asunto: string;
}

// Obtener etapas de la plantilla del expediente
export const obtenerEtapasPlantillaExpediente = async (idExpediente: number) => {
  try {
    const response = await axiosWithoutMultipart.get(`/expedientes/${idExpediente}`);
    if (response.data.success && response.data.data?.expediente?.plantilla?.id_plantilla) {
      // Obtener etapas de la plantilla
      const etapasResponse = await axiosWithoutMultipart.get(`/plantillas/${response.data.data.expediente.plantilla.id_plantilla}/etapas`);
      return etapasResponse.data;
    }
    return null;
  } catch (error: any) {
    console.error('Error al obtener etapas de la plantilla:', error);
    throw error;
  }
};

// Obtener flujo actual del expediente
export const obtenerFlujoActualExpediente = async (idExpediente: number) => {
  try {
    const response = await axiosWithoutMultipart.get(`/flujo/expediente/${idExpediente}/actual`);
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener flujo actual:', error);
    throw error;
  }
};

// Listar todos los flujos del expediente con estados
export const listarFlujosPorExpediente = async (idExpediente: number) => {
  try {
    const response = await axiosWithoutMultipart.get(`/flujo/expediente/${idExpediente}/listar`);
    return response.data;
  } catch (error: any) {
    console.error('Error al listar flujos del expediente:', error);
    throw error;
  }
};

// Cambiar etapa y subetapa del expediente (crea nuevo asunto)
export const cambiarEtapaSubetapaExpediente = async (data: CambiarEtapaExpedienteRequest) => {
  try {
    const response = await axiosWithoutMultipart.post('/flujo/cambiar-etapa-subetapa', data);
    return response.data;
  } catch (error: any) {
    console.error('Error al cambiar etapa/subetapa:', error);
    throw error;
  }
};

// Actualizar flujo/asunto existente (corregir errores)
export const actualizarFlujoExpediente = async (
  idFlujo: number, 
  data: ActualizarFlujoExpedienteRequest
) => {
  try {
    const response = await axiosWithoutMultipart.patch(`/flujo/${idFlujo}/actualizar-flujo-asunto`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar flujo/asunto:', error);
    throw error;
  }
};