import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { Plantilla, ListarPlantillasResponse } from '../schemas/PlantillaSchema';

export interface ObtenerPlantillasResponse {
  success: boolean;
  data: {
    plantillas: Plantilla[];
  };
}

export const obtenerPlantillas = async (): Promise<ObtenerPlantillasResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerPlantillasResponse>('plantillas');
  return response.data;
};

export const obtenerPlantillaPorId = async (id: number): Promise<{ success: boolean; data: { plantilla: Plantilla } }> => {
  const response = await axiosWithoutMultipart.get(`plantillas/${id}`);
  return response.data;
};
