export interface ExpedienteItem {
  id: number;
  codigo_expediente: string;
  creado_en?: string | null;
}

export interface MisExpedientesResponse {
  success: boolean;
  message: string;
  data: {
    expedientes: ExpedienteItem[];
  };
}

export interface DocumentoAdjunto {
  id_adjunto: number;
  ruta_archivo: string;
  nombre_archivo: string;
}

export interface DocumentosAdjuntosResponse {
  success: boolean;
  message: string;
  data: {
    documentos: DocumentoAdjunto[];
  };
}
