import { useState } from 'react';
import { registrarSolicitud } from '../services/registroSolicitudService';
import { RegistroSolicitudRequest } from '../schemas/RegistroSolicitudSchema';

export function useRegistroSolicitud() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const registrar = async (data: RegistroSolicitudRequest) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    setShowSuccessModal(false);
    try {
      const res = await registrarSolicitud(data);
      setResponse(res.data);
      setSuccessMsg(res.message);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMsg('');
    setResponse(null);
  };

  return {
    loading,
    error,
    successMsg,
    showSuccessModal,
    response,
    registrar,
    setError,
    setSuccessMsg,
    closeSuccessModal
  };
}
