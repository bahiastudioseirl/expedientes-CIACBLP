import { axiosWithoutMultipart } from '../../../api/axiosInstance';

/**
 * Verifica si el expediente está en etapa 1, subetapa 5 para mostrar contadores
 */
export const verificarMostrarContadores = async (idExpediente: number) => {
  try {
    const response = await axiosWithoutMultipart.get(
      `/flujo/expediente/${idExpediente}/verificar-contadores`
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Error al verificar estado del expediente:', error);
    return {
      success: false,
      data: { mostrar_contadores: false }
    };
  }
};