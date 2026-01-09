import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistroSolicitud } from '../hooks/useRegistroSolicitud';
import { RegistroSolicitudForm } from '../components/RegistroSolicitudForm';

export const RegistroSolicitudPage = () => {
  const {
    loading,
    error,
    successMsg,
    response,
    registrar,
    setError,
    setSuccessMsg
  } = useRegistroSolicitud();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/registro-solicitante');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="registro-solicitud-container">
        <RegistroSolicitudForm 
          onSubmit={registrar}
          loading={loading}
          error={error}
          successMsg={successMsg}
          setError={setError}
        />
        
        {response && (
          <div className="max-w-4xl mx-auto mt-8 bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-green-700 font-medium">¡Solicitud registrada exitosamente!</p>
                <p className="text-green-600 text-sm mt-1">Su solicitud ha sido procesada correctamente.</p>
              </div>
            </div>
          </div>
        )}
        
        {successMsg && (
          <div className="max-w-4xl mx-auto mt-8 bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-green-700 font-medium">{successMsg}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
