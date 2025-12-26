import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { ActualizarPlantillaRequest, CrearPlantillaResponse, CambiarEstadoResponse } from '../schemas/PlantillaSchema';

export const actualizarPlantilla = async (
  id: number, 
  data: ActualizarPlantillaRequest
): Promise<CrearPlantillaResponse> => {
  const response = await axiosWithoutMultipart.patch<CrearPlantillaResponse>(`plantillas/${id}`, data);
  return response.data;
};

export const cambiarEstadoPlantilla = async (id: number): Promise<CambiarEstadoResponse> => {
  const response = await axiosWithoutMultipart.put<CambiarEstadoResponse>(`plantillas/${id}/estado`);
  return response.data;
};
