// Schema para el camino del expediente
export interface CaminoExpedienteData {
  expediente: {
    codigo_expediente: string;
    id_expediente: number;
    activo: boolean;
    created_at: string;
    demandante: Participante[];
    demandado: Participante[];
    arbitro: Usuario | null;
    secretario: Usuario | null;
  };
  flujos: FlujoConMensajes[];
}

export interface Participante {
  nombre_razon: string;
  numero_documento: string;
  telefono: string;
  correos: string[];
}

export interface Usuario {
  id: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  rol: string;
}

export interface FlujoConMensajes {
  id_flujo: number;
  estado: 'en_proceso' | 'completado' | 'vencido';
  estado_calculado: string;
  fecha_inicio: string;
  fecha_limite: string | null;
  fecha_fin: string | null;
  etapa: {
    id_etapa: number;
    nombre: string;
  } | null;
  subetapa: {
    id_sub_etapa: number;
    nombre: string;
  } | null;
  mensajes: MensajeCamino[];
}

export interface MensajeCamino {
  id_mensaje: number;
  contenido: string;
  fecha_envio: string;
  usuario: {
    id: number;
    nombre_completo: string;
    rol: string;
  };
  adjuntos: AdjuntoCamino[];
}

export interface AdjuntoCamino {
  id_adjunto: number;
  nombre_archivo: string;
  ruta_archivo: string;
  url_descarga: string;
}

// Response types
export interface CaminoExpedienteResponse {
  success: boolean;
  message: string;
  data: CaminoExpedienteData;
}