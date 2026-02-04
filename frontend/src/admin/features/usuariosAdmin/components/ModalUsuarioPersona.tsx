import { X, User, Phone, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CrearUsuarioRequest, ActualizarUsuarioRequest, Usuario } from "../schemas/UsuarioSchema";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: (data: CrearUsuarioRequest) => Promise<void> | void;
  onUpdate?: (data: ActualizarUsuarioRequest) => Promise<void> | void;
  loading?: boolean;
  usuario?: Usuario | null; // Para editar
  tipoUsuario: 'administrador' | 'secretario' | 'arbitro' | 'contador';
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

  const [formData, setFormData] = useState<CrearUsuarioRequest>({
    nombre_completo: "",
    numero_documento: "",
    telefono: "",
    correo: ""
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
      case 'contador': return `${accion} Contador`;
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
        setFormData({
          nombre_completo: usuario.nombre_completo,
          numero_documento: usuario.numero_documento,
          telefono: usuario.telefono,
          correo: usuario.correo
        });
      } else {
        setFormData({
          nombre_completo: "",
          numero_documento: "",
          telefono: "",
          correo: ""
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_completo.trim()) {
      setError("El nombre completo es obligatorio");
      return;
    }
    if (!formData.correo.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError(`El correo \"${formData.correo}\" no tiene un formato válido`);
      return;
    }
    try {
      if (isEditing && onUpdate) {
        await onUpdate(formData as ActualizarUsuarioRequest);
        // Cerrar modal después de actualización exitosa
        onClose();
      } else if (!isEditing && onSave) {
        await onSave(formData);
        // Solo limpiar formulario si es creación
        setFormData({ nombre_completo: "", numero_documento: "", telefono: "", correo: "" });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el ${tipoUsuario}`;
      setError(errorMessage);
    }
  };

  if (!open) return null;

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

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-slate-700">
                <User className="inline w-4 h-4 mr-1" />
                Nombre Completo
              </label>
              <input
                ref={inputRef}
                type="text"
                id="nombre"
                value={formData.nombre_completo}
                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingresa el nombre completo"
              />
            </div>

            <div>
              <label htmlFor="numero_documento" className="block mb-2 text-sm font-medium text-slate-700">
                Número de Documento
              </label>
              <input
                type="text"
                id="numero_documento"
                value={formData.numero_documento}
                onChange={(e) => setFormData({ ...formData, numero_documento: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingresa el número de documento"
              />
            </div>


            <div>
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
            <div>
              <label htmlFor="correo" className="block mb-2 text-sm font-medium text-slate-700">
                <Mail className="inline w-4 h-4 mr-1" />
                Correo
              </label>
              <input
                type="email"
                id="correo"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="correo@ejemplo.com"
              />
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