import { FormSection } from './FormSection';
import { FormField } from './FormField';

interface DemandadoData {
    nombre_razon: string;
    numero_documento: string;
    telefono: string;
}

interface CorreoDemandado {
    correo: string;
    es_principal: boolean;
}

interface RepresentanteDemandado {
    nombre_completo: string;
    numero_documento: string;
    telefono: string;
}

interface DemandadoExtra {
    mesa_partes_virtual: boolean;
    direccion_fiscal: string;
}

interface DemandadoFormProps {
    demandado: DemandadoData;
    correos: CorreoDemandado[];
    representante: RepresentanteDemandado;
    demandadoExtra: DemandadoExtra;
    onChange: (field: string, value: string | boolean) => void;
    onAddCorreo: () => void;
    onRemoveCorreo: (index: number) => void;
}

export const DemandadoForm = ({
    demandado,
    correos,
    representante,
    demandadoExtra,
    onChange,
    onAddCorreo,
    onRemoveCorreo
}: DemandadoFormProps) => {
    // Handlers con tipado específico
    const handleFieldChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        onChange(field, value);
    };

    const handleCorreoChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(`correos_demandado.${index}.correo`, e.target.value);
    };

    return (
        <FormSection number={2} title="Datos del Demandado">
            {/* Datos básicos del demandado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <FormField
                    label="Nombre o Razón Social"
                    name="demandado.nombre_razon"
                    value={demandado.nombre_razon}
                    onChange={handleFieldChange('demandado.nombre_razon')}
                    placeholder="Ej. Maria López o Empresa XYZ S.A."
                    required
                />
                <FormField
                    label="Número de Documento"
                    name="demandado.numero_documento"
                    value={demandado.numero_documento}
                    onChange={handleFieldChange('demandado.numero_documento')}
                    placeholder="Ingresar DNI o RUC"
                    required
                />
            </div>
            <div className="mb-4 sm:mb-6">
                <FormField
                    label="Número de teléfono"
                    name="demandado.telefono"
                    type="tel"
                    value={demandado.telefono}
                    onChange={handleFieldChange('demandado.telefono')}
                    placeholder="999 999 999"
                    required
                />
            </div>

            {/* Correos del demandado */}
            <div className="mt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Dirección de correos electrónicos <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                    {correos.map((correo, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 sm:p-4 bg-white/80 border-2 border-gray-100 rounded-lg sm:rounded-xl hover:border-purple-200 transition-all duration-200 shadow-sm">
                            <div className="flex-1">
                                <input
                                    type="email"
                                    value={correo.correo}
                                    onChange={handleCorreoChange(idx)}
                                    className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#733AEA] focus:ring-2 sm:focus:ring-4 focus:ring-purple-100 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium text-sm"
                                    placeholder={idx === 0 ? "Correo principal *" : "Correo secundario"}
                                    required={idx === 0}
                                />
                                {idx === 0 && (
                                    <small className="text-[#733AEA] font-semibold text-xs mt-1 block flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Este será el correo principal
                                    </small>
                                )}
                            </div>
                            {idx > 0 && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveCorreo(idx)}
                                    className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2"
                                    title="Eliminar correo secundario"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={onAddCorreo}
                    className="w-full sm:w-auto mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 transition-all duration-200 font-semibold text-xs sm:text-sm border-2 border-gray-200 hover:border-purple-300 flex items-center justify-center gap-2"
                >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar correos secundarios
                </button>
            </div>

            {/* Representante del demandado */}
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50/80 to-gray-100/80 border-2 border-gray-200 rounded-2xl backdrop-blur-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                    Representante Legal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                    <FormField
                        label="Nombre Completo"
                        name="representante_demandado.nombre_completo"
                        value={representante.nombre_completo}
                        onChange={handleFieldChange('representante_demandado.nombre_completo')}
                        placeholder="Nombre completo del representante"
                        required
                    />
                    <FormField
                        label="Número de Documento"
                        name="representante_demandado.numero_documento"
                        value={representante.numero_documento}
                        onChange={handleFieldChange('representante_demandado.numero_documento')}
                        placeholder="Ingresar DNI"
                        required
                    />
                    <FormField
                        label="Teléfono de Contacto (opcional)"
                        name="representante_demandado.telefono"
                        type="tel"
                        value={representante.telefono}
                        onChange={handleFieldChange('representante_demandado.telefono')}
                        placeholder="999 999 999"
                    />
                </div>
            </div>

            {/* Mesa de partes virtual */}
            <div className="mt-8">
                <div className="mt-8 p-6 bg-gradient-to-br from-gray-50/80 to-gray-100/80 border-2 border-gray-200 rounded-2xl backdrop-blur-sm">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Mesa de Partes Virtual</label>
                    <div className="flex gap-8 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="demandado_extra.mesa_partes_virtual"
                                checked={demandadoExtra.mesa_partes_virtual === true}
                                onChange={() => onChange('demandado_extra.mesa_partes_virtual', true)}
                                className="w-5 h-5 text-[#733AEA] bg-white border-2 border-gray-300 rounded-full focus:ring-[#733AEA] focus:ring-2"
                            />
                            <span className="font-medium">Sí</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="demandado_extra.mesa_partes_virtual"
                                checked={demandadoExtra.mesa_partes_virtual === false}
                                onChange={() => onChange('demandado_extra.mesa_partes_virtual', false)}
                                className="w-5 h-5 text-[#733AEA] bg-white border-2 border-gray-300 rounded-full focus:ring-[#733AEA] focus:ring-2"
                            />
                            <span className="font-medium">No</span>
                        </label>
                    </div>
                </div>
                {demandadoExtra.mesa_partes_virtual === false && (
                    <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <FormField
                            label="Dirección física para notificación *"
                            name="demandado_extra.direccion_fiscal"
                            value={demandadoExtra.direccion_fiscal}
                            onChange={handleFieldChange('demandado_extra.direccion_fiscal')}
                            placeholder="Ej. Calle los Pinos 123, Lima, Perú"
                            required={demandadoExtra.mesa_partes_virtual === false}
                        />
                    </div>
                )}
            </div>
        </FormSection>
    );
};
