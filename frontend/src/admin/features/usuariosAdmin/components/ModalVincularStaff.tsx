import { X, Search, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { buscarArbitros, buscarSecretarios, vincularStaffAExpediente } from "../services/usuariosService";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  expedienteId: number;
};

type Usuario = {
  id: number;
  nombre_completo: string;
  correo: string;
  telefono?: string;
  rol?: string;
};

export default function ModalVincularStaff({
  open,
  onClose,
  onSave,
  expedienteId
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'arbitro' | 'secretario'>('arbitro');
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<Usuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTipoSeleccionado('arbitro');
      setBusqueda("");
      setResultados([]);
      setUsuarioSeleccionado(null);
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

  const realizarBusqueda = async () => {
    if (!busqueda.trim() || busqueda.length < 2) {
      setResultados([]);
      return;
    }

    setError("");
    try {
      const response = tipoSeleccionado === 'arbitro' 
        ? await buscarArbitros(busqueda.trim())
        : await buscarSecretarios(busqueda.trim());
      setResultados(response.data || []);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setError("Error al buscar usuarios");
      setResultados([]);
    }
  };

  const handleClose = () => {
    setBusqueda("");
    setResultados([]);
    setUsuarioSeleccionado(null);
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuarioSeleccionado) {
      setError("Selecciona un usuario");
      return;
    }

    console.log('Usuario seleccionado:', usuarioSeleccionado);
    console.log('ID específico:', usuarioSeleccionado.id);
    console.log('Tipo de ID:', typeof usuarioSeleccionado.id);
    console.log('Expediente ID:', expedienteId);
    console.log('Tipo seleccionado:', tipoSeleccionado);

    setIsLoading(true);
    setError("");

    const payload = {
      id_usuario: usuarioSeleccionado.id
    };
    
    console.log('Payload final a enviar:', payload);
    console.log('Payload como JSON:', JSON.stringify(payload));

    try {
      await vincularStaffAExpediente(expedienteId, payload);
      onSave();
      handleClose();
    } catch (error: any) {
      console.error("Error al vincular staff:", error);
      setError(error.response?.data?.message || "Error al vincular el usuario al expediente");
    } finally {
      setIsLoading(false);
    }
  };

  const seleccionarUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setResultados([]);
  };

  const cambiarTipo = (nuevoTipo: 'arbitro' | 'secretario') => {
    setTipoSeleccionado(nuevoTipo);
    setBusqueda("");
    setResultados([]);
    setUsuarioSeleccionado(null);
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Vincular {tipoSeleccionado === 'arbitro' ? 'Árbitro' : 'Secretario'}
              </h2>
              <p className="text-sm text-slate-600">
                Busca y selecciona el {tipoSeleccionado} para vincular
              </p>
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

          {/* Tipo de Staff */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Tipo de Staff
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  value="arbitro"
                  checked={tipoSeleccionado === 'arbitro'}
                  onChange={() => cambiarTipo('arbitro')}
                  disabled={isLoading}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-slate-700">Árbitro</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  value="secretario"
                  checked={tipoSeleccionado === 'secretario'}
                  onChange={() => cambiarTipo('secretario')}
                  disabled={isLoading}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-slate-700">Secretario</span>
              </label>
            </div>
          </div>

          {/* Búsqueda */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              <Search className="inline w-4 h-4 mr-1" />
              Buscar {tipoSeleccionado === 'arbitro' ? 'Árbitro' : 'Secretario'}
            </label>
            <div className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  if (e.target.value.length >= 2) {
                    realizarBusqueda();
                  } else {
                    setResultados([]);
                  }
                }}
                placeholder={`Escribe el nombre del ${tipoSeleccionado}...`}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Resultados */}
              {resultados.length > 0 && (
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg">
                  {resultados.map((usuario) => (
                    <div
                      key={usuario.id}
                      onClick={() => seleccionarUsuario(usuario)}
                      className="p-3 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <p className="font-medium text-slate-900">{usuario.nombre_completo}</p>
                      <p className="text-sm text-slate-600">{usuario.correo}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Usuario seleccionado */}
          {usuarioSeleccionado && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">{usuarioSeleccionado.nombre_completo}</p>
                  <p className="text-sm text-green-700">{usuarioSeleccionado.correo}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setUsuarioSeleccionado(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Info */}
          {busqueda.length > 0 && busqueda.length < 2 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600">Escribe al menos 2 caracteres para buscar</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-6 space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !usuarioSeleccionado}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Vinculando...</span>
                </div>
              ) : (
                `Vincular ${tipoSeleccionado === 'arbitro' ? 'Árbitro' : 'Secretario'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}