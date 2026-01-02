import { useState, useEffect } from 'react';
import { X, FileText, Building2, Save, AlertCircle } from 'lucide-react';
import FormParticipante from './FormParticipante';
import { obtenerPlantillasSimples } from '../services/obtenerPlantillas';
import type { 
  ActualizarExpedienteRequest, 
  ExpedienteFormData, 
  FormParticipante as FormParticipanteType,
  Expediente 
} from '../schemas/ExpedienteSchema';

interface ModalEditarExpedienteProps {
  open: boolean;
  expediente: Expediente | null;
  onClose: () => void;
  onSave: (id: number, data: ActualizarExpedienteRequest) => Promise<void>;
  loading: boolean;
}

interface PlantillaSimple {
  id_plantilla: number;
  nombre: string;
}

const initialParticipante: FormParticipanteType = {
  numero_documento: "",
  nombre: "",
  apellido: "",
  nombre_empresa: "",
  telefono: "",
  correos: [""],
  loading: false,
  existe: false,
  error: "",
  usuarioTipo: undefined,
  usuarioRol: undefined
};

export default function ModalEditarExpediente({ 
  open, 
  expediente,
  onClose, 
  onSave, 
  loading 
}: ModalEditarExpedienteProps) {
  const [formData, setFormData] = useState<ExpedienteFormData>(() => ({
    codigo_expediente: "",
    asunto: "",
    id_plantilla: 0,
    demandante: { ...initialParticipante },
    demandado: { ...initialParticipante },
    secretario_arbitral: { ...initialParticipante },
    arbitro_a_cargo: { ...initialParticipante }
  }));

  const [plantillas, setPlantillas] = useState<PlantillaSimple[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPlantillas, setLoadingPlantillas] = useState(true);

  // Cargar plantillas y datos del expediente al abrir modal
  useEffect(() => {
    if (open && expediente) {
      cargarPlantillas();
      // Pequeño delay para asegurar que el modal esté completamente renderizado
      setTimeout(() => {
        cargarDatosExpediente();
      }, 100);
    } else if (!open) {
      // Resetear formulario cuando se cierra el modal
      setFormData({
        codigo_expediente: "",
        asunto: "",
        id_plantilla: 0,
        demandante: { ...initialParticipante },
        demandado: { ...initialParticipante },
        secretario_arbitral: { ...initialParticipante },
        arbitro_a_cargo: { ...initialParticipante }
      });
      setErrors({});
    }
  }, [open, expediente]);



  const cargarPlantillas = async () => {
    setLoadingPlantillas(true);
    try {
      const response = await obtenerPlantillasSimples();
      if (response.success) {
        setPlantillas(response.data.plantillas);
      }
    } catch (error) {
      setPlantillas([]);
    } finally {
      setLoadingPlantillas(false);
    }
  };

  const cargarDatosExpediente = () => {
    if (!expediente) return;

    // Función más robusta para encontrar participantes por rol
    const getRolParticipante = (rolesABuscar: string[]) => {
      return expediente.participantes.find(p => {
        const rolLower = p.usuario?.rol_nombre?.toLowerCase() || '';
        return rolesABuscar.some(rol => 
          rolLower.includes(rol.toLowerCase()) || 
          rol.toLowerCase().includes(rolLower)
        );
      });
    };

    const demandante = getRolParticipante(["demandante"]);
    const demandado = getRolParticipante(["demandado"]);
    const secretario = getRolParticipante(["secretario", "secretario arbitral"]);
    const arbitro = getRolParticipante(["árbitro", "arbitro", "árbitro a cargo", "arbitro a cargo"]);
    
    const newFormData = {
      codigo_expediente: expediente.codigo_expediente,
      asunto: expediente.asunto || '',
      id_plantilla: expediente.plantilla.id_plantilla || 0,
      demandante: demandante ? {
        numero_documento: demandante.usuario.numero_documento,
        nombre_empresa: demandante.usuario.nombre_empresa || "",
        telefono: demandante.usuario.telefono,
        correos: [...demandante.usuario.correos],
        nombre: "",
        apellido: "",
        loading: false,
        existe: true,
        error: "",
        usuarioTipo: undefined,
        usuarioRol: undefined
      } : { ...initialParticipante },
      demandado: demandado ? {
        numero_documento: demandado.usuario.numero_documento,
        nombre_empresa: demandado.usuario.nombre_empresa || "",
        telefono: demandado.usuario.telefono,
        correos: [...demandado.usuario.correos],
        nombre: "",
        apellido: "",
        loading: false,
        existe: true,
        error: "",
        usuarioTipo: undefined,
        usuarioRol: undefined
      } : { ...initialParticipante },
      secretario_arbitral: secretario ? {
        numero_documento: secretario.usuario.numero_documento,
        nombre: secretario.usuario.nombre,
        apellido: secretario.usuario.apellido,
        telefono: secretario.usuario.telefono,
        correos: [...secretario.usuario.correos],
        nombre_empresa: "",
        loading: false,
        existe: true,
        error: "",
        usuarioTipo: undefined,
        usuarioRol: undefined
      } : { ...initialParticipante },
      arbitro_a_cargo: arbitro ? {
        numero_documento: arbitro.usuario.numero_documento,
        nombre: arbitro.usuario.nombre,
        apellido: arbitro.usuario.apellido,
        telefono: arbitro.usuario.telefono,
        correos: [...arbitro.usuario.correos],
        nombre_empresa: "",
        loading: false,
        existe: true,
        error: "",
        usuarioTipo: undefined,
        usuarioRol: undefined
      } : { ...initialParticipante }
    };

    setFormData(newFormData);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar campos generales
    if (!formData.codigo_expediente.trim()) {
      newErrors.codigo_expediente = "El código del expediente es obligatorio";
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = "El asunto es obligatorio";
    }

    if (!formData.id_plantilla || formData.id_plantilla === 0) {
      newErrors.id_plantilla = "Debe seleccionar una plantilla";
    }

    // Validar participantes
    const participantes = [
      { key: 'demandante', data: formData.demandante, label: 'Demandante' },
      { key: 'demandado', data: formData.demandado, label: 'Demandado' },
      { key: 'secretario_arbitral', data: formData.secretario_arbitral, label: 'Secretario Arbitral' },
      { key: 'arbitro_a_cargo', data: formData.arbitro_a_cargo, label: 'Árbitro a Cargo' }
    ];

    participantes.forEach(({ key, data, label }) => {
      if (!data.numero_documento.trim()) {
        newErrors[`${key}_numero_documento`] = `El número de documento del ${label} es obligatorio`;
      }
      // Validar nombre_empresa para demandante/demandado
      if ((label === 'Demandante' || label === 'Demandado')) {
        if (!data.nombre_empresa || !data.nombre_empresa.trim()) {
          newErrors[`${key}_nombre_empresa`] = `El nombre de la empresa del ${label} es obligatorio`;
        }
      } else {
        if (!data.nombre || !data.nombre.trim()) {
          newErrors[`${key}_nombre`] = `El nombre del ${label} es obligatorio`;
        }
        if (!data.apellido || !data.apellido.trim()) {
          newErrors[`${key}_apellido`] = `El apellido del ${label} es obligatorio`;
        }
      }
      if (!data.telefono.trim()) {
        newErrors[`${key}_telefono`] = `El teléfono del ${label} es obligatorio`;
      }
      // Validar correos
      const correosValidos = data.correos.filter(correo => correo.trim() !== "");
      if (correosValidos.length === 0) {
        newErrors[`${key}_correos`] = `Al menos un correo del ${label} es obligatorio`;
      } else {
        correosValidos.forEach((correo, index) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(correo)) {
            newErrors[`${key}_correo_${index}`] = `El correo "${correo}" no es válido`;
          }
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !expediente) return;

    const requestData: ActualizarExpedienteRequest = {
      codigo_expediente: formData.codigo_expediente.trim(),
      asunto: formData.asunto.trim(),
      id_plantilla: formData.id_plantilla,
      demandante: {
        numero_documento: formData.demandante.numero_documento,
        nombre_empresa: formData.demandante.nombre_empresa?.trim() || undefined,
        telefono: formData.demandante.telefono.trim(),
        correos: formData.demandante.correos.filter(correo => correo.trim() !== "")
      },
      demandado: {
        numero_documento: formData.demandado.numero_documento,
        nombre_empresa: formData.demandado.nombre_empresa?.trim() || undefined,
        telefono: formData.demandado.telefono.trim(),
        correos: formData.demandado.correos.filter(correo => correo.trim() !== "")
      },
      secretario_arbitral: {
        numero_documento: formData.secretario_arbitral.numero_documento,
        nombre: formData.secretario_arbitral.nombre?.trim() || "",
        apellido: formData.secretario_arbitral.apellido?.trim() || "",
        telefono: formData.secretario_arbitral.telefono.trim(),
        correos: formData.secretario_arbitral.correos.filter(correo => correo.trim() !== "")
      },
      arbitro_a_cargo: {
        numero_documento: formData.arbitro_a_cargo.numero_documento,
        nombre: formData.arbitro_a_cargo.nombre?.trim() || "",
        apellido: formData.arbitro_a_cargo.apellido?.trim() || "",
        telefono: formData.arbitro_a_cargo.telefono.trim(),
        correos: formData.arbitro_a_cargo.correos.filter(correo => correo.trim() !== "")
      }
    };

    await onSave(expediente.id_expediente, requestData);
  };

  if (!open || !expediente) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" onClick={onClose} />
      
      <div className="relative z-[61] bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Editar Expediente</h2>
              <p className="text-xs sm:text-sm text-slate-600 truncate max-w-[200px] sm:max-w-none">{expediente.codigo_expediente}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-4 sm:space-y-6">
            {/* Información general */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Código de expediente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Código de Expediente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.codigo_expediente}
                  onChange={(e) => setFormData({ ...formData, codigo_expediente: e.target.value })}
                  placeholder="EXP-2025-0001"
                  disabled={loading}
                  className="w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-50"
                />
                {errors.codigo_expediente && (
                  <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.codigo_expediente}</span>
                  </p>
                )}
              </div>

              {/* Plantilla */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Plantilla <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.id_plantilla}
                    onChange={(e) => setFormData({ ...formData, id_plantilla: parseInt(e.target.value) })}
                    disabled={loading || loadingPlantillas}
                    className="w-full pl-10 py-2.5 pr-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-50 appearance-none bg-white"
                  >
                    <option value={0}>
                      {loadingPlantillas ? "Cargando plantillas..." : "Seleccione una plantilla"}
                    </option>
                    {plantillas.map((plantilla) => (
                      <option key={plantilla.id_plantilla} value={plantilla.id_plantilla}>
                        {plantilla.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.id_plantilla && (
                  <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.id_plantilla}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Asunto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Asunto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.asunto}
                onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                placeholder="Descripción del asunto del expediente"
                disabled={loading}
                className="w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-50"
              />
              {errors.asunto && (
                <p className="text-xs text-red-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.asunto}</span>
                </p>
              )}
            </div>

            {/* Participantes */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
                Participantes del Expediente
              </h3>

              {/* Demandante */}
              <FormParticipante
                data={{ ...formData.demandante, nombre: '', apellido: '', usuarioRol: 'Demandante' }}
                onChange={(data) => setFormData({ ...formData, demandante: { ...data, nombre: '', apellido: '', usuarioRol: 'Demandante' } })}
                label="Demandante"
                placeholder="Datos del demandante"
                disabled={loading}
              />

              {/* Demandado */}
              <FormParticipante
                data={{ ...formData.demandado, nombre: '', apellido: '', usuarioRol: 'Demandado' }}
                onChange={(data) => setFormData({ ...formData, demandado: { ...data, nombre: '', apellido: '', usuarioRol: 'Demandado' } })}
                label="Demandado"
                placeholder="Datos del demandado"
                disabled={loading}
              />

              {/* Secretario Arbitral */}
              <FormParticipante
                data={formData.secretario_arbitral}
                onChange={(data) => setFormData({ ...formData, secretario_arbitral: data })}
                label="Secretario Arbitral"
                placeholder="Datos del secretario arbitral"
                disabled={loading}
              />

              {/* Árbitro a Cargo */}
              <FormParticipante
                data={formData.arbitro_a_cargo}
                onChange={(data) => setFormData({ ...formData, arbitro_a_cargo: data })}
                label="Árbitro a Cargo"
                placeholder="Datos del árbitro a cargo"
                disabled={loading}
              />
            </div>
          </div>
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
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 order-1 sm:order-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Actualizar Expediente</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}