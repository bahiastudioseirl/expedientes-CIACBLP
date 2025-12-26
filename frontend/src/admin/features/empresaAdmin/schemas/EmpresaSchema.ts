export interface CrearEmpresaRequest {
  nombre: string;
}

export interface EmpresaUser {
  id_usuario: number;
  nombre: string;
  apellido: string;
}

export interface Empresa {
  id_empresa: number;
  nombre: string;
  activo: boolean;
  usuario: EmpresaUser;
  created_at: string;
  updated_at: string;
}

export interface EmpresaCreateData {
  empresa: Empresa;
}

export interface CrearEmpresaResponse {
  success: boolean;
  message: string;
  data: EmpresaCreateData;
}


export interface ObtenerEmpresasResponse {
  success: boolean;
  message: string;
  data: EmpresaCreateData;
}