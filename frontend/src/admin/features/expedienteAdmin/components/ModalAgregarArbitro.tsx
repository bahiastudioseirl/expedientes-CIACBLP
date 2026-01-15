import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Loader2, CheckCircle } from 'lucide-react';
import { buscarArbitros, ArbitroBusqueda } from '../services/buscarArbitros';
import { agregarArbitroExpediente, AgregarArbitroRequest } from '../services/agregarArbitroExpediente';
import ModalExitoArbitro from './ModalExitoArbitro';

interface ModalAgregarArbitroProps {
  open: boolean;
  onClose: () => void;
  idExpediente: number;
  onSuccess: () => void;
}

export default function ModalAgregarArbitro({
  open,
  onClose,
  idExpediente,
  onSuccess,
}: ModalAgregarArbitroProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [resultados, setResultados] = useState<ArbitroBusqueda[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{ mensaje: string; nombreArbitro: string; correoArbitro: string } | null>(null);

  const [formData, setFormData] = useState<AgregarArbitroRequest>({
    nombre_arbitro: '',
    numero_documento: '',
    correo_arbitro: '',
    telefono_arbitro: '',
  });

  useEffect(() => {
    if (!open) {
      // Reset al cerrar
      setSearchTerm('');
      setResultados([]);
      setShowResults(false);
      setShowSuccessModal(false);
      setSuccessData(null);
      setFormData({
        nombre_arbitro: '',
        numero_documento: '',
        correo_arbitro: '',
        telefono_arbitro: '',
      });
    }
  }, [open]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setSearching(true);
        try {
          const data = await buscarArbitros(searchTerm);
          setResultados(data);
          setShowResults(true);
        } catch (error) {
          console.error('Error buscando árbitros:', error);
          alert('Error al buscar árbitros');
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
      nombre_arbitro: arbitro.nombre_completo,
      numero_documento: arbitro.numero_documento,
      correo_arbitro: arbitro.correo,
      telefono_arbitro: arbitro.telefono || '',
    });
    setSearchTerm(arbitro.nombre_completo);
    setShowResults(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
    onSuccess();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre_arbitro || !formData.numero_documento || !formData.correo_arbitro) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setSubmitting(true);
    try {
      const response = await agregarArbitroExpediente(idExpediente, formData);
      
      // Mostrar modal de éxito
      setSuccessData({
        mensaje: response.message,
        nombreArbitro: formData.nombre_arbitro,
        correoArbitro: formData.correo_arbitro
      });
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('Error al agregar árbitro:', error);
      alert(error.response?.data?.message || 'Error al agregar árbitro al expediente');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Agregar Árbitro</h2>
              <p className="text-sm text-slate-600">Busca y asigna un árbitro al expediente</p>
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
          {/* Búsqueda de árbitro */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Buscar Árbitro <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                        {arbitro.origen === 'bd_principal' ? 'Registrado' : 'Árbitro'}
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
          </div>

          {/* Formulario de datos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre_arbitro}
                onChange={(e) => setFormData({ ...formData, nombre_arbitro: e.target.value })}
                placeholder="Nombre completo del árbitro"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Número de Documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.numero_documento}
                onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                placeholder="DNI o documento"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teléfono
              </label>
              <input
                type="text"
                value={formData.telefono_arbitro}
                onChange={(e) => setFormData({ ...formData, telefono_arbitro: e.target.value })}
                placeholder="Número de teléfono"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.correo_arbitro}
                onChange={(e) => setFormData({ ...formData, correo_arbitro: e.target.value })}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
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
                  Agregando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Agregar Árbitro
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Modal de éxito */}
      {showSuccessModal && successData && (
        <ModalExitoArbitro
          open={showSuccessModal}
          onClose={handleSuccessClose}
          nombreArbitro={successData.nombreArbitro}
          correoArbitro={successData.correoArbitro}
          mensaje={successData.mensaje}
        />
      )}
    </div>
  );
}
