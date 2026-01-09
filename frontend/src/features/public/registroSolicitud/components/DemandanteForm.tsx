import { FormSection } from './FormSection';
import { FormField } from './FormField';

interface DemandanteData {
    nombre_razon: string;
    numero_documento: string;
    telefono: string;
}

interface CorreoDemandante {
    correo: string;
    es_principal: boolean;
}

interface RepresentanteDemandante {
    nombre_completo: string;
    numero_documento: string;
    telefono: string;
}

interface DemandanteFormProps {
    demandante: DemandanteData;
    correos: CorreoDemandante[];
    representante: RepresentanteDemandante;
    onChange: (field: string, value: string) => void;
    onAddCorreo: () => void;
    onRemoveCorreo: (index: number) => void;
}

export const DemandanteForm = ({
    demandante,
    correos,
    representante,
    onChange,
    onAddCorreo,
    onRemoveCorreo
}: DemandanteFormProps) => {
    // Handlers con tipado específico
    const handleFieldChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(field, e.target.value);
    };

    const handleCorreoChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(`correos_demandante.${index}.correo`, e.target.value);
    };
    return (
        <FormSection number={1} title="Datos del Demandante">
            {/* Datos básicos del demandante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Nombre o Razón Social"
                    name="demandante.nombre_razon"
                    value={demandante.nombre_razon}
                    onChange={handleFieldChange('demandante.nombre_razon')}
                    placeholder="Ej: Juan Pérez García o Empresa ABC S.A."
                    required
                />

                <FormField
                    label="Número de Documento"
                    name="demandante.numero_documento"
                    value={demandante.numero_documento}
                    onChange={handleFieldChange('demandante.numero_documento')}
                    placeholder="Ingresar DNI o RUC"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6" >
                <FormField
                    label="Número de teléfono"
                    name="demandante.telefono"
                    type="tel"
                    value={demandante.telefono}
                    onChange={handleFieldChange('demandante.telefono')}
                    placeholder="999 999 999"
                    className="md:col-span-2"
                    required
                />
            </div>

            {/* Correos del demandante */}
            <div className="mt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Dirección de correos electrónicos <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                    {correos.map((correo, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-white/80 border-2 border-gray-100 rounded-xl hover:border-purple-200 transition-all duration-200 shadow-sm">
                            <div className="flex-1">
                                <input
                                    type="email"
                                    value={correo.correo}
                                    onChange={handleCorreoChange(idx)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#733AEA] focus:ring-4 focus:ring-purple-100 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium"
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
                                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2"
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
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 transition-all duration-200 font-semibold text-sm border-2 border-gray-200 hover:border-purple-300 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar correos secundarios
                </button>
            </div>

            {/* Representante del demandante */}
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50/80 to-gray-100/80 border-2 border-gray-200 rounded-2xl backdrop-blur-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                    Representante Legal <span className="text-sm font-normal text-gray-600"></span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <FormField
                        label="Nombre Completo"
                        name="representante_demandante.nombre_completo"
                        value={representante.nombre_completo}
                        onChange={handleFieldChange('representante_demandante.nombre_completo')}
                        placeholder="Nombre completo del representante"
                        required
                    />

                    <FormField
                        label="Número de Documento"
                        name="representante_demandante.numero_documento"
                        value={representante.numero_documento}
                        onChange={handleFieldChange('representante_demandante.numero_documento')}
                        placeholder="Ingresar DNI"
                        required
                    />

                    <FormField  
                        label="Número de teléfono (opcional)"
                        name="representante_demandante.telefono"
                        type="tel"
                        value={representante.telefono}
                        onChange={handleFieldChange('representante_demandante.telefono')}
                        placeholder="999 999 999"
                    />
                </div>
            </div>
        </FormSection>
    );
};