import { X, Plus, Mail, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { AgregarParticipanteRequest } from "../schemas/UsuarioSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: AgregarParticipanteRequest) => Promise<void>;
};

export default function ModalAgregarParticipante({
  open,
  onClose,
  onSave
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<AgregarParticipanteRequest>({
    correo: "",
    tipo: "demandante"
  });

  useEffect(() => {
    if (open) {
      setFormData({
        correo: "",
        tipo: "demandante"
      });
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleClose = () => {
    setFormData({
      correo: "",
      tipo: "demandante"
    });
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.correo.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError("Formato de correo electrónico inválido");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await onSave(formData);
      handleClose();
    } catch (err: any) {
      console.error('Error al agregar participante:', err);
      const errorMessage = 
        err?.response?.data?.message || 
        err?.message || 
        'Error al agregar el participante. Inténtalo de nuevo.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AgregarParticipanteRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError("");
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Agregar Participante</h2>
              <p className="text-sm text-slate-600">Agrega un participante al expediente</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 text-slate-400 transition-colors hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Correo Electrónico */}
          <div>
            <label htmlFor="correo" className="block mb-2 text-sm font-medium text-slate-700">
              <Mail className="inline w-4 h-4 mr-1" />
              Correo Electrónico
            </label>
            <input
              ref={inputRef}
              id="correo"
              type="email"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={(e) => handleInputChange('correo', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Tipo de Participante */}
          <div>
            <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-slate-700">
              <Users className="inline w-4 h-4 mr-1" />
              Tipo de Participante
            </label>
            <select
              id="tipo"
              disabled={isLoading}
              value={formData.tipo}
              onChange={(e) => handleInputChange('tipo', e.target.value as 'demandante' | 'demandado')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="demandante">Demandante</option>
              <option value="demandado">Demandado</option>
            </select>
          </div>

          {/* Información adicional */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Información importante
            </h3>
            <div className="text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Se enviará un correo con las credenciales de acceso</li>
                <li>El usuario podrá acceder al expediente inmediatamente</li>
                <li>Si el correo ya existe, se asociará al expediente</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Agregando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Agregar Participante</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}