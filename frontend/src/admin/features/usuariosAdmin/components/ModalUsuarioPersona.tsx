import { X, User, Phone, Mail, FileText, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CrearUsuarioPersonaRequest, ActualizarUsuarioPersonaRequest, Usuario } from "../schemas/UsuarioSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: (data: CrearUsuarioPersonaRequest) => Promise<void> | void;
  onUpdate?: (data: ActualizarUsuarioPersonaRequest) => Promise<void> | void;
  loading?: boolean;
  usuario?: Usuario | null; // Para editar
  tipoUsuario: 'administrador' | 'secretario' | 'arbitro';
};

export default function ModalUsuarioPersona({ 
  open, 
  onClose, 
  onSave, 
  onUpdate,
  loading = false, 
  usuario = null,
  tipoUsuario
}: Props) {
  const isEditing = !!usuario;
  
  const [formData, setFormData] = useState<CrearUsuarioPersonaRequest>({
    numero_documento: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correos: [""]
  });
  
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Mapear títulos según el tipo
  const getTitulo = () => {
    const accion = isEditing ? 'Editar' : 'Crear';
    switch (tipoUsuario) {
      case 'administrador': return `${accion} Administrador`;
      case 'secretario': return `${accion} Secretario`;
      case 'arbitro': return `${accion} Árbitro`;
    }
  };

  const getDescripcion = () => {
    const accion = isEditing ? 'Edita' : 'Agrega';
    const articulo = tipoUsuario === 'arbitro' ? 'un' : 'un';
    return `${accion} ${articulo} ${tipoUsuario} ${isEditing ? 'existente' : 'al sistema'}`;
  };

  useEffect(() => {
    if (open) {
      if (isEditing && usuario) {
        const correos = usuario.correos?.map(c => c.direccion) || [''];
        setFormData({
          numero_documento: usuario.numero_documento || "",
          nombre: usuario.nombre || "",
          apellido: usuario.apellido || "",
          telefono: usuario.telefono || "",
          correos: correos.length > 0 ? correos : [""]
        });
      } else {
        setFormData({
          numero_documento: "",
          nombre: "",
          apellido: "",
          telefono: "",
          correos: [""]
        });
      }
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, usuario, isEditing]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleCorreoChange = (index: number, valor: string) => {
    const nuevosCorreos = [...formData.correos];
    nuevosCorreos[index] = valor;
    setFormData({ ...formData, correos: nuevosCorreos });
  };

  const agregarCorreo = () => {
    setFormData({ ...formData, correos: [...formData.correos, ""] });
  };

  const eliminarCorreo = (index: number) => {
    if (formData.correos.length > 1) {
      const nuevosCorreos = formData.correos.filter((_, i) => i !== index);
      setFormData({ ...formData, correos: nuevosCorreos });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    if (!formData.apellido.trim()) {
      setError("El apellido es requerido");
      return;
    }

    if (!isEditing && !formData.numero_documento.trim()) {
      setError("El número de documento es requerido");
      return;
    }

    if (!formData.telefono.trim()) {
      setError("El teléfono es requerido");
      return;
    }

    const correosValidos = formData.correos.filter(correo => correo.trim() !== "");
    if (correosValidos.length === 0) {
      setError("Al menos un correo es requerido");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const correo of correosValidos) {
      if (!emailRegex.test(correo)) {
        setError(`El correo "${correo}" no tiene un formato válido`);
        return;
      }
    }

    try {
      const dataToSend = {
        ...formData,
        correos: correosValidos
      };

      if (isEditing && onUpdate) {
        const { numero_documento, ...updateData } = dataToSend;
        await onUpdate(updateData as ActualizarUsuarioPersonaRequest);
      } else if (!isEditing && onSave) {
        await onSave(dataToSend);
      }
      
      // Reset form solo si no estamos editando
      if (!isEditing) {
        setFormData({
          numero_documento: "",
          nombre: "",
          apellido: "",
          telefono: "",
          correos: [""]
        });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el ${tipoUsuario}`;
      setError(errorMessage);
    }
  };

  if (!open) return null;

  const showDocumento = !isEditing && tipoUsuario !== 'arbitro';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{getTitulo()}</h2>
              <p className="text-sm text-slate-600">{getDescripcion()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 transition-colors hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {showDocumento && (
              <div className="sm:col-span-2">
                <label htmlFor="numero_documento" className="block mb-2 text-sm font-medium text-slate-700">
                  <FileText className="inline w-4 h-4 mr-1" />
                  Número de Documento
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="numero_documento"
                  value={formData.numero_documento}
                  onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ingresa el número de documento"
                />
              </div>
            )}

            <div>
              <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-slate-700">
                <User className="inline w-4 h-4 mr-1" />
                Nombre
              </label>
              <input
                ref={!showDocumento ? inputRef : undefined}
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingresa el nombre"
              />
            </div>

            <div>
              <label htmlFor="apellido" className="block mb-2 text-sm font-medium text-slate-700">
                <User className="inline w-4 h-4 mr-1" />
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingresa el apellido"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-slate-700">
                <Phone className="inline w-4 h-4 mr-1" />
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingresa el teléfono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-slate-700">
                <Mail className="inline w-4 h-4 mr-1" />
                Correos Electrónicos
              </label>
              <div className="space-y-2">
                {formData.correos.map((correo, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => handleCorreoChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="correo@ejemplo.com"
                    />
                    {formData.correos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarCorreo(index)}
                        className="p-2 text-red-600 transition-colors hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={agregarCorreo}
                  className="flex items-center px-3 py-2 text-sm text-purple-600 transition-colors hover:text-purple-800"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar otro correo
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}