import { axiosWithoutMultipart } from '../../../../api/axiosInstance';
import type { CrearPlantillaRequest, CrearPlantillaResponse } from '../schemas/PlantillaSchema';

export const crearPlantilla = async (data: CrearPlantillaRequest): Promise<CrearPlantillaResponse> => {
  const response = await axiosWithoutMultipart.post<CrearPlantillaResponse>('plantillas', data);
  return response.data;
};
