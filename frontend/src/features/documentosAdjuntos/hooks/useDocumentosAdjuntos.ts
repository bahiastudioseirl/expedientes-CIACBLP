import { useEffect, useState } from 'react';
import { obtenerAdjuntosPorExpediente, obtenerMisExpedientes } from '../services/documentosAdjuntosService';
import type { DocumentoAdjunto, ExpedienteItem } from '../schemas/documentosAdjuntosSchema';

interface EstadoAdjuntos {
  expedientes: ExpedienteItem[];
  adjuntos: DocumentoAdjunto[];
  expedienteSeleccionado: number | null;
  cargandoExpedientes: boolean;
  cargandoAdjuntos: boolean;
  error: string;
}

export const useDocumentosAdjuntos = () => {
  const [state, setState] = useState<EstadoAdjuntos>({
    expedientes: [],
    adjuntos: [],
    expedienteSeleccionado: null,
    cargandoExpedientes: false,
    cargandoAdjuntos: false,
    error: ''
  });

  useEffect(() => {
    const cargarExpedientes = async () => {
      setState(prev => ({ ...prev, cargandoExpedientes: true, error: '' }));
      try {
        const res = await obtenerMisExpedientes();
        const expedientes = res.data.expedientes ?? [];
        setState(prev => ({ ...prev, expedientes, cargandoExpedientes: false }));
      } catch (error: any) {
        setState(prev => ({ ...prev, cargandoExpedientes: false, error: error?.message || 'No se pudieron cargar los expedientes' }));
      }
    };

    cargarExpedientes();
  }, []);

  const seleccionarExpediente = async (idExpediente: number) => {
    setState(prev => ({ ...prev, expedienteSeleccionado: idExpediente, cargandoAdjuntos: true, error: '' }));
    try {
      const res = await obtenerAdjuntosPorExpediente(idExpediente);
      setState(prev => ({ ...prev, adjuntos: res.data.documentos ?? [], cargandoAdjuntos: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, cargandoAdjuntos: false, error: error?.message || 'No se pudieron cargar los adjuntos' }));
    }
  };

  return {
    ...state,
    seleccionarExpediente
  };
};
