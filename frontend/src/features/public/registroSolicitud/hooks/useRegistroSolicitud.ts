import { useState } from 'react';
import { registrarSolicitud } from '../services/registroSolicitudService';
import { RegistroSolicitudRequest } from '../schemas/RegistroSolicitudSchema';

export function useRegistroSolicitud() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [response, setResponse] = useState<any>(null);

  const registrar = async (data: RegistroSolicitudRequest) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await registrarSolicitud(data);
      setResponse(res.data);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    successMsg,
    response,
    registrar,
    setError,
    setSuccessMsg
  };
}
