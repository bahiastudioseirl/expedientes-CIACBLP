import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistroSolicitud } from '../hooks/useRegistroSolicitud';
import { RegistroSolicitudForm } from '../components/RegistroSolicitudForm';
import { Navbar } from '../../../../components/common/Navbar';

export const RegistroSolicitudPage = () => {
  const {
    loading,
    error,
    successMsg,
    showSuccessModal,
    response,
    registrar,
    setError,
    closeSuccessModal
  } = useRegistroSolicitud();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/registro-solicitante');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="py-8">
        <div className="registro-solicitud-container">
          <RegistroSolicitudForm 
            onSubmit={registrar}
            loading={loading}
            error={error}
            showSuccessModal={showSuccessModal}
            successMessage={successMsg}
            onCloseSuccessModal={closeSuccessModal}
            setError={setError}
          />
        </div>
      </div>
    </div>
  );
};
