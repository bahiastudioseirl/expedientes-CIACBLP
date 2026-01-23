import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type {
  CambiarEtapaExpedienteRequest,
  ActualizarFlujoExpedienteRequest,
  FlujoActualResponse,
  FlujosResponse,
  CambiarEtapaResponse,
  ActualizarFlujoResponse,
  EtapasPlantillaResponse
} from '../schemas/FlujoSchema';

// Obtener flujo actual del expediente
export const obtenerFlujoActualExpediente = async (idExpediente: number): Promise<FlujoActualResponse> => {
  const response = await axiosWithoutMultipart.get<FlujoActualResponse>(`flujo/expediente/${idExpediente}/actual`);
  return response.data;
};

// Listar todos los flujos del expediente
export const listarFlujosPorExpediente = async (idExpediente: number): Promise<FlujosResponse> => {
  const response = await axiosWithoutMultipart.get<FlujosResponse>(`flujo/expediente/${idExpediente}/listar`);
  return response.data;
};

// Cambiar de etapa/subetapa (crea nuevo flujo)
export const cambiarEtapaSubetapaExpediente = async (
  idExpediente: number,
  data: CambiarEtapaExpedienteRequest
): Promise<CambiarEtapaResponse> => {
  const response = await axiosWithoutMultipart.post<CambiarEtapaResponse>(
    `flujo/${idExpediente}/cambiar-etapa-subetapa`,
    data
  );
  return response.data;
};

// Actualizar flujo actual
export const actualizarFlujoExpediente = async (
  idExpediente: number,
  data: ActualizarFlujoExpedienteRequest
): Promise<ActualizarFlujoResponse> => {
  const response = await axiosWithoutMultipart.patch<ActualizarFlujoResponse>(
    `flujo/${idExpediente}/actualizar-flujo`,
    data
  );
  return response.data;
};

// Obtener etapas de la plantilla del expediente

export const obtenerEtapasPlantillaExpediente = async (idExpediente: number): Promise<EtapasPlantillaResponse> => {
  const response = await axiosWithoutMultipart.get(`expedientes/${idExpediente}/etapas-plantilla`);

  // Mapear sub_etapas a subetapas para compatibilidad con el frontend
  const etapas = (response.data?.data || []).map((etapa: any) => ({
    ...etapa,
    subetapas: etapa.sub_etapas || []
  }));

  return {
    success: response.data?.success ?? true,
    data: etapas
  };
};
