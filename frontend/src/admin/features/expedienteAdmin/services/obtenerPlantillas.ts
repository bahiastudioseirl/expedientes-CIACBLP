import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

interface PlantillaSimple {
  id_plantilla: number;
  nombre: string;
}

interface ObtenerPlantillasResponse {
  success: boolean;
  data: {
    plantillas: PlantillaSimple[];
  };
}

export const obtenerPlantillasSimples = async (): Promise<ObtenerPlantillasResponse> => {
  const response = await axiosWithoutMultipart.get<ObtenerPlantillasResponse>('plantillas');
  return response.data;
};