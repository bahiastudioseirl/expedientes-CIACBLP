import { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { buscarArbitros, ArbitroBusqueda } from '../../expedienteAdmin/services/buscarArbitros';
import { crearArbitro } from '../services/usuariosService';
import type { CrearUsuarioRequest } from '../schemas/UsuarioSchema';

interface ModalCrearArbitroProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCrearArbitro({
  open,
  onClose,
  onSuccess,
}: ModalCrearArbitroProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [resultados, setResultados] = useState<ArbitroBusqueda[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [datosFromBusqueda, setDatosFromBusqueda] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CrearUsuarioRequest>({
    nombre_completo: '',
    numero_documento: '',
    correo: '',
    telefono: '',
  });

  useEffect(() => {
    if (open) {
      setError('');
      setSearchTerm('');
      setResultados([]);
      setShowResults(false);
      setDatosFromBusqueda(false);
      setUseManualEntry(false);
      setFormData({
        nombre_completo: '',
        numero_documento: '',
        correo: '',
        telefono: '',
      });
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setSearching(true);
        try {
          const data = await buscarArbitros(searchTerm);
          setResultados(data);
          setShowResults(true);
          setDatosFromBusqueda(false);
        } catch (error) {
          console.error('Error buscando árbitros:', error);
          setError('Error al buscar árbitros');
        } finally {
          setSearching(false);
        }
      } else {
        setResultados([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const handleSelectArbitro = (arbitro: ArbitroBusqueda) => {
    setFormData({
      nombre_completo: arbitro.nombre_completo,
      numero_documento: arbitro.numero_documento || '',
      correo: arbitro.correo,
      telefono: arbitro.telefono || '',
    });
    setSearchTerm(arbitro.nombre_completo);
    setShowResults(false);
    setDatosFromBusqueda(true);
    setUseManualEntry(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre_completo.trim()) {
      setError('El nombre completo es obligatorio');
      return;
    }
    if (!formData.correo.trim()) {
      setError('El correo electrónico es obligatorio');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError(`El correo "${formData.correo}" no tiene un formato válido`);
      return;
    }

    setSubmitting(true);
    try {
      await crearArbitro(formData);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error al crear árbitro:', error);
      setError(error.response?.data?.message || 'Error al crear árbitro');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative inset-0 flex items-center justify-center p-4 h-screen">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Crear Árbitro</h2>
                <p className="text-sm text-slate-600">Busca un árbitro existente o crea uno nuevo</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Opciones de entrada */}
            <div className="flex gap-3 border-b border-slate-200 pb-4">
              <button
                type="button"
                onClick={() => {
                  setUseManualEntry(false);
                  setDatosFromBusqueda(false);
                  setSearchTerm('');
                  setError('');
                  setFormData({ nombre_completo: '', numero_documento: '', correo: '', telefono: '' });
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  !useManualEntry
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseManualEntry(true);
                  setSearchTerm('');
                  setError('');
                }}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  useManualEntry
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Crear Manual
              </button>
            </div>

            {/* Búsqueda de árbitro */}
            {!useManualEntry && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Buscar Árbitro Existente
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setDatosFromBusqueda(false);
                      setError('');
                    }}
                    placeholder="Escribe el nombre del árbitro..."
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 animate-spin" />
                  )}
                </div>

                {/* Resultados de búsqueda */}
                {showResults && resultados.length > 0 && (
                  <div className="mt-2 border border-slate-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
                    {resultados.map((arbitro) => (
                      <button
                        key={`${arbitro.origen}-${arbitro.id}`}
                        type="button"
                        onClick={() => handleSelectArbitro(arbitro)}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{arbitro.nombre_completo}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                              <span>DNI: {arbitro.numero_documento}</span>
                              <span>{arbitro.correo}</span>
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              arbitro.origen === 'bd_principal'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {arbitro.origen === 'bd_principal' ? 'Sistema' : 'Árbitro'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showResults && resultados.length === 0 && !searching && (
                  <div className="mt-2 p-4 text-center text-sm text-slate-500 border border-slate-200 rounded-lg bg-slate-50">
                    No se encontraron árbitros con ese nombre
                  </div>
                )}

                {datosFromBusqueda && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-700">
                      <p className="font-medium">Datos cargados exitosamente</p>
                      <p className="text-xs mt-0.5">Los campos se han rellenado con la información del árbitro</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mensaje de error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Formulario de datos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) => {
                    setFormData({ ...formData, nombre_completo: e.target.value });
                    setError('');
                  }}
                  placeholder="Nombre completo del árbitro"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Número de Documento
                </label>
                <input
                  type="text"
                  value={formData.numero_documento}
                  onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                  placeholder="Número de documento"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Número de teléfono"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.correo}
                  onChange={(e) => {
                    setFormData({ ...formData, correo: e.target.value });
                    setError('');
                  }}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Crear Árbitro
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
