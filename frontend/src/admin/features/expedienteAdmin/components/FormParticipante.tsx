import { useEffect, useState } from 'react';
import { Search, User, Phone, Mail, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import type { FormParticipante } from '../schemas/ExpedienteSchema';
import { verificarUsuario } from '../services/verificarUsuario';

interface FormParticipanteProps {
  data: FormParticipante;
  onChange: (data: FormParticipante) => void;
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormParticipanteComponent({ 
  data, 
  onChange, 
  label, 
  placeholder, 
  required = true, 
  disabled = false 
}: FormParticipanteProps) {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Buscar usuario cuando cambia el número de documento
  useEffect(() => {
    const numeroDocumento = (data.numero_documento || "").trim();
    
    if (numeroDocumento && numeroDocumento.length >= 8) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      const timeout = setTimeout(async () => {
        try {
          onChange({ ...data, loading: true, error: "" });
          
          const response = await verificarUsuario(numeroDocumento);
          
          if (response.success && response.data.existe && response.data.usuario) {
            const usuario = response.data.usuario;
            onChange({
              ...data,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              telefono: usuario.telefono,
              correos: usuario.correos && usuario.correos.length > 0 ? usuario.correos : [""], // Asegurar que siempre haya al menos un campo de correo
              existe: true,
              loading: false,
              error: "",
              usuarioTipo: usuario.tipo, // Guardar el tipo de usuario
              usuarioRol: usuario.rol || (usuario.tipo === 'arbitro' ? 'Árbitro' : '')
            });
          } else {
            onChange({
              ...data,
              existe: false,
              loading: false,
              error: "",
              usuarioTipo: undefined,
              usuarioRol: undefined
            });
          }
        } catch (error: any) {
          onChange({
            ...data,
            existe: false,
            loading: false,
            error: "Error al verificar usuario",
            usuarioTipo: undefined,
            usuarioRol: undefined
          });
        }
      }, 800);
      
      setSearchTimeout(timeout);
    } else {
      onChange({
        ...data,
        existe: false,
        loading: false,
        error: "",
        usuarioTipo: undefined,
        usuarioRol: undefined
      });
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [data.numero_documento]);

  const handleNumeroDocumentoChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/\D/g, '');
    
    onChange({
      numero_documento: numericValue,
      nombre: "",
      apellido: "",
      telefono: "",
      correos: [""],
      existe: false,
      loading: false,
      error: "",
      usuarioTipo: undefined,
      usuarioRol: undefined
    });
  };

  const handleAddCorreo = () => {
    const currentCorreos = Array.isArray(data.correos) ? data.correos : [""];
    onChange({
      ...data,
      correos: [...currentCorreos, ""]
    });
  };

  const handleRemoveCorreo = (index: number) => {
    const currentCorreos = Array.isArray(data.correos) ? data.correos : [""];
    if (currentCorreos.length > 1) {
      onChange({
        ...data,
        correos: currentCorreos.filter((_, i) => i !== index)
      });
    }
  };

  const handleCorreoChange = (index: number, value: string) => {
    const currentCorreos = Array.isArray(data.correos) ? data.correos : [""];
    const newCorreos = [...currentCorreos];
    newCorreos[index] = value;
    onChange({
      ...data,
      correos: newCorreos
    });
  };

  const isFieldsDisabled = disabled || (!data.numero_documento.trim() || data.numero_documento.length < 8);

  return (
    <div className="space-y-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
      <div className="flex items-center space-x-2">
        <User className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-medium text-slate-900">{label}</h3>
        {required && <span className="text-red-500">*</span>}
      </div>

      {/* Número de documento */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Número de documento {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={data.numero_documento || ""}
            onChange={(e) => handleNumeroDocumentoChange(e.target.value)}
            placeholder="Ingrese número de documento"
            maxLength={20}
            disabled={disabled}
            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {/* Indicadores de estado */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {data.loading && (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
            {!data.loading && data.numero_documento.length >= 8 && data.existe && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            {!data.loading && data.numero_documento.length >= 8 && data.existe === false && (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
          </div>
        </div>
        
        {/* Mensajes de estado */}
        {data.numero_documento.length >= 8 && !data.loading && (
          <div className="mt-1">
            {data.existe && (
              <>
                <p className="text-xs text-green-600 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>
                    {data.usuarioTipo === 'arbitro' 
                      ? 'Árbitro encontrado en el sistema - datos obtenidos automáticamente'
                      : 'Usuario encontrado - puede editar los datos si es necesario'
                    }
                  </span>
                </p>
                {data.usuarioTipo && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center space-x-1">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>
                      Tipo: {data.usuarioTipo === 'arbitro' ? 'Árbitro Registrado' : 'Usuario del Sistema'}
                      {data.usuarioRol && ` - ${data.usuarioRol}`}
                    </span>
                  </p>
                )}
              </>
            )}
            {data.existe === false && (
              <p className="text-xs text-orange-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Usuario nuevo - complete todos los datos requeridos</span>
              </p>
            )}
          </div>
        )}
        
        {data.numero_documento.length > 0 && data.numero_documento.length < 8 && (
          <p className="text-xs text-slate-500 mt-1">
            Complete el número de documento para habilitar los demás campos
          </p>
        )}
        
        {data.error && (
          <p className="text-xs text-red-600 mt-1">{data.error}</p>
        )}
      </div>

      {/* Campos de datos personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={data.nombre || ""}
            onChange={(e) => onChange({ ...data, nombre: e.target.value })}
            placeholder="Nombre"
            disabled={isFieldsDisabled}
            className="w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apellido {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={data.apellido || ""}
            onChange={(e) => onChange({ ...data, apellido: e.target.value })}
            placeholder="Apellido"
            disabled={isFieldsDisabled}
            className="w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Teléfono {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="tel"
            value={data.telefono || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              onChange({ ...data, telefono: value });
            }}
            placeholder="Número de teléfono"
            maxLength={15}
            disabled={isFieldsDisabled}
            className="w-full pl-10 py-2.5 pr-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* Correos electrónicos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">
            Correos electrónicos {required && <span className="text-red-500">*</span>}
          </label>
          <button
            type="button"
            onClick={handleAddCorreo}
            disabled={isFieldsDisabled}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
        
        <div className="space-y-2">
          {data.correos.map((correo, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={correo || ""}
                  onChange={(e) => handleCorreoChange(index, e.target.value)}
                  placeholder="correo@ejemplo.com"
                  disabled={isFieldsDisabled}
                  className="w-full pl-10 py-2.5 pr-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
              
              {data.correos.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCorreo(index)}
                  disabled={isFieldsDisabled}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}