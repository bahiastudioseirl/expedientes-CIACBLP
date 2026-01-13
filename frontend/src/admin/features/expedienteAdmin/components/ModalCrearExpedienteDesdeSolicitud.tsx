import { useState, useEffect } from 'react';
import { X, FileText, Save, AlertCircle, Mail, Phone, User, Building2, CheckCircle } from 'lucide-react';
import { obtenerDatosPartes } from '../../solicitudAdmin/services/obtenerDatosPartes';
import { crearExpedienteDesdeAdmitida, type AdmitirYCrearExpedienteRequest } from '../services/admitirYCrearExpediente';
import type { DatosPartesExpediente, DatosParteSolicitud } from '../schemas/ExpedienteSchema';

interface ModalCrearExpedienteDesdeSolicitudProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  idSolicitud: number;
}

export default function ModalCrearExpedienteDesdeSolicitud({
  open,
  onClose,
  onSuccess,
  idSolicitud
}: ModalCrearExpedienteDesdeSolicitudProps) {
  const [loading, setLoading] = useState(false);
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [codigoExpediente, setCodigoExpediente] = useState('');
  const [datosPartes, setDatosPartes] = useState<DatosPartesExpediente | null>(null);
  const [error, setError] = useState('');

  // Datos del secretario
  const [nombreSecretario, setNombreSecretario] = useState('');
  const [correoSecretario, setCorreoSecretario] = useState('');
  const [telefonoSecretario, setTelefonoSecretario] = useState('');

  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && idSolicitud) {
      cargarDatos();
    } else {
      resetForm();
    }
  }, [open, idSolicitud]);

  const cargarDatos = async () => {
    setLoadingDatos(true);
    setError('');
    try {
      const response = await obtenerDatosPartes(idSolicitud);
      if (response.success) {
        setDatosPartes(response.data);
        // Generar código automáticamente
        const year = new Date().getFullYear();
        setCodigoExpediente(`001-${year}-CIACBLP`);
      }
    } catch (err: any) {
      setError('Error al cargar los datos de la solicitud');
      console.error(err);
    } finally {
      setLoadingDatos(false);
    }
  };

  const resetForm = () => {
    setCodigoExpediente('');
    setDatosPartes(null);
    setNombreSecretario('');
    setCorreoSecretario('');
    setTelefonoSecretario('');
    setErrors({});
    setError('');
    setLoadingDatos(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nombreSecretario.trim()) {
      newErrors.nombre_secretario = 'El nombre del secretario es obligatorio';
    }

    if (!correoSecretario.trim()) {
      newErrors.correo_secretario = 'El correo del secretario es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correoSecretario)) {
        newErrors.correo_secretario = 'El correo no es válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const requestData: AdmitirYCrearExpedienteRequest = {
        nombre_secretario: nombreSecretario.trim(),
        correo_secretario: correoSecretario.trim(),
        telefono_secretario: telefonoSecretario.trim() || undefined
      };

      const response = await crearExpedienteDesdeAdmitida(idSolicitud, requestData);

      if (response.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al crear el expediente';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const renderDatosParte = (parte: DatosParteSolicitud, tipo: 'Demandante' | 'Demandado') => (
    <div className={`p-4 rounded-xl border-2 ${
      tipo === 'Demandante' 
        ? 'bg-emerald-50 border-emerald-200' 
        : 'bg-rose-50 border-rose-200'
    }`}>
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg ${
          tipo === 'Demandante' ? 'bg-emerald-100' : 'bg-rose-100'
        }`}>
          <Building2 className={`w-5 h-5 ${
            tipo === 'Demandante' ? 'text-emerald-600' : 'text-rose-600'
          }`} />
        </div>
        <h4 className={`font-bold text-lg ml-2 ${
          tipo === 'Demandante' ? 'text-emerald-900' : 'text-rose-900'
        }`}>
          {tipo}
        </h4>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Razón Social / Nombre
          </label>
          <p className="text-sm font-medium text-slate-900">{parte.nombre_razon}</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Número de Documento
          </label>
          <p className="text-sm font-medium text-slate-900">{parte.numero_documento}</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Correos Electrónicos
          </label>
          <div className="space-y-1">
            {parte.correos.todos.map((correoObj, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Mail className="w-3 h-3 text-slate-400" />
                <p className="text-sm text-slate-700">{correoObj.correo}</p>
                {correoObj.es_principal && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Teléfono
          </label>
          <div className="flex items-center space-x-2">
            <Phone className="w-3 h-3 text-slate-400" />
            <p className="text-sm text-slate-700">{parte.telefono}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />

      <div className="relative z-[61] bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-blue-50">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Crear Expediente</h2>
              <p className="text-xs sm:text-sm text-slate-600">Desde Solicitud #{idSolicitud}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loadingDatos ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                <p className="text-sm text-slate-600">Cargando datos de la solicitud...</p>
              </div>
            </div>
          ) : datosPartes ? (
            <div className="space-y-6">
              {/* Código de Expediente */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <label className="block text-sm font-bold text-blue-900">
                    Código de Expediente (Generado Automáticamente)
                  </label>
                </div>
                <input
                  type="text"
                  value={codigoExpediente}
                  disabled
                  className="w-full py-2.5 px-3 bg-white border-2 border-blue-300 rounded-lg font-mono font-bold text-blue-900 text-lg cursor-not-allowed"
                />
              </div>

              {/* Datos de las Partes */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Datos de las Partes (Solo Lectura)
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {renderDatosParte(datosPartes.demandante, 'Demandante')}
                  {renderDatosParte(datosPartes.demandado, 'Demandado')}
                </div>
              </div>

              {/* Datos del Secretario */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Datos del Secretario Arbitral
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nombreSecretario}
                      onChange={(e) => setNombreSecretario(e.target.value)}
                      placeholder="Ej: Juan Pérez García"
                      disabled={loading}
                      className="w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                    />
                    {errors.nombre_secretario && (
                      <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.nombre_secretario}</span>
                      </p>
                    )}
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={correoSecretario}
                      onChange={(e) => setCorreoSecretario(e.target.value)}
                      placeholder="secretario@example.com"
                      disabled={loading}
                      className="w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                    />
                    {errors.correo_secretario && (
                      <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.correo_secretario}</span>
                      </p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Teléfono (Opcional)
                    </label>
                    <input
                      type="text"
                      value={telefonoSecretario}
                      onChange={(e) => setTelefonoSecretario(e.target.value)}
                      placeholder="987654321"
                      disabled={loading}
                      className="w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || loadingDatos}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 bg-[#132436] text-white rounded-lg hover:bg-[#224666] transition-colors disabled:opacity-50 order-1 sm:order-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Crear Expediente</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
