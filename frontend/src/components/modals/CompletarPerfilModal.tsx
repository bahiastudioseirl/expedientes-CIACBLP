import React, { useState } from 'react';
import { X, User, Save } from 'lucide-react';

interface CompletarPerfilModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: {
    id_usuario: number;
    nombre_completo?: string;
    correo: string;
    rol: string;
  };
  onSave: (nombreCompleto: string) => Promise<boolean>;
}

export const CompletarPerfilModal: React.FC<CompletarPerfilModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave
}) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombreCompleto.trim()) {
      setError('El nombre completo es obligatorio');
      return;
    }

    if (nombreCompleto.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await onSave(nombreCompleto.trim());
      if (success) {
        // Solo cerrar si se permite y se guardó exitosamente
        onClose?.();
      } else {
        setError('Error al guardar la información. Intente nuevamente.');
      }
    } catch (err) {
      setError('Error al guardar la información. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const roleTitle = currentUser.rol === 'Demandante' ? 'Demandante' : 'Demandado';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Completar Perfil</h2>
                <p className="text-blue-100 text-sm">Portal {roleTitle}</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Bienvenido(a) al sistema de arbitraje CIACBLP.
            </p>
            <p className="text-gray-600 text-sm">
              Para continuar, necesitamos que complete su información personal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Correo (solo lectura) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={currentUser.correo}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed pr-8"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Este campo no se puede modificar</p>
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombreCompleto}
                onChange={(e) => {
                  setNombreCompleto(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ingrese su nombre completo"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={loading}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ejemplo: Juan Carlos Pérez García
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">⚠️ {error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || !nombreCompleto.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar y Continuar</span>
                  </>
                )}
              </button>
              
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Esta información es necesaria para la gestión del proceso arbitral.
          </p>
        </div>
      </div>
    </div>
  );
};