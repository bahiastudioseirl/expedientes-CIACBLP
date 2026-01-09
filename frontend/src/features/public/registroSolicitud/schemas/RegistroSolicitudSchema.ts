export interface Parte {
  nombre_razon: string;
  numero_documento: string;
  telefono: string;
}

export interface Correo {
  correo: string;
  es_principal: boolean;
}

export interface Representante {
  nombre_completo: string;
  numero_documento: string;
  telefono: string;
}

export interface DemandadoExtra {
  mesa_partes_virtual: boolean;
  direccion_fiscal: string;
}

export interface Pretension {
  descripcion: string;
  determinada: boolean;
  cuantia: number | null;
}

export interface Designacion {
  arbitro_unico: boolean;
  propone_arbitro: boolean;
  encarga_ciacblp: boolean;
}

export interface Arbitro {
  nombre_completo: string;
  correo: string;
  telefono: string;
}

export interface RegistroSolicitudRequest {
  demandante: Parte;
  correos_demandante: Correo[];
  representante_demandante: Representante;
  demandado: Parte;
  correos_demandado: Correo[];
  representante_demandado: Representante;
  demandado_extra: DemandadoExtra;
  resumen_controversia: string;
  resumen_controversia_tipo: 'texto' | 'archivo';
  resumen_controversia_archivo: File | null;
  pretensiones: Pretension[];
  medida_cautelar: string;
  designacion: Designacion;
  arbitros: Arbitro[];
  link_anexo: string;
}
