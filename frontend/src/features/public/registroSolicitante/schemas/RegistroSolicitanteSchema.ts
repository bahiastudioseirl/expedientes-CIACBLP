export interface RegistroSolicitanteRequest {
  nombre_completo: string;
  numero_documento: string;
  correo: string;
}

export interface RegistroSolicitanteResponse {
  success: boolean;
  message: string;
  data: {
    usuario: {
      id_usuario_solicitante: number;
      nombre_completo: string;
      numero_documento: string;
      correo: string;
    };
  };
}

export interface VerificarCodigoRequest {
  codigo: string;
}

export interface VerificarCodigoResponse {
  success: boolean;
  message: string;
  data: {
    usuario: {
      id_usuario_solicitante: number;
      nombre_completo: string;
      numero_documento: string;
      correo: string;
    };
    token: string;
    token_type: string;
  };
}
