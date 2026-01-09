import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistroSolicitante } from '../hooks/useRegistroSolicitante';
import { RegistroSolicitanteForm } from "../components/RegistroSolicitanteForm";
import { VerificarCodigoForm } from "../components/VerificarCodigoForm";
import logoCiacblp from '../../../../assets/logo-ciacblp.webp';

export const RegistroSolicitantePage = () => {
  const {
    usuario,
    verificado,
    token,
    loading,
    error,
    successMsg,
    registrar,
    verificar,
    setError,
  } = useRegistroSolicitante();

  const navigate = useNavigate();

  useEffect(() => {
    if (verificado && token) {
      localStorage.setItem('authToken', token);
      setTimeout(() => {
        navigate('/registro-solicitud');
      }, 2000); 
    }
  }, [verificado, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e4e4e4]/30 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-60 rounded-full flex items-center justify-center mb-2">
              <img src={logoCiacblp} alt="Logo CIACBLP" className="max-h-full max-w-full object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registro de Solicitante</h2>
            <p className="text-sm text-gray-600 mb-4">
              {verificado
                ? "¡Registro y verificación completados! Ya puedes iniciar sesión."
                : usuario
                ? "Ingresa el código que recibiste en tu correo."
                : "Completa el formulario con sus datos."}
            </p>
          </div>
          {!usuario && !verificado && (
            <RegistroSolicitanteForm onSuccess={registrar} error={error} loading={loading} successMsg={successMsg} setError={setError} />
          )}
          {usuario && !verificado && (
            <VerificarCodigoForm onSuccess={verificar} error={error} loading={loading} setError={setError} />
          )}
          {verificado && token && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-center">
              ¡Registro y verificación exitosos! Redirigiendo automáticamente al registro de solicitud...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
