import { axiosWithoutMultipart } from '../../../../api/axiosInstance';

export interface ArbitroBusqueda {
  id: number;
  nombre_completo: string;
  numero_documento: string;
  telefono: string | null;
  correo: string;
  origen: 'bd_principal' | 'bd_secundaria';
}

export interface BuscarArbitrosResponse {
  success: boolean;
  data: ArbitroBusqueda[];
}

export const buscarArbitros = async (nombre: string): Promise<ArbitroBusqueda[]> => {
  const { data } = await axiosWithoutMultipart.get<BuscarArbitrosResponse>(
    `/arbitros/buscar?nombre=${encodeURIComponent(nombre)}`
  );
  return data.data;
};
