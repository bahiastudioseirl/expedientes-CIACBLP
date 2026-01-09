    import React from 'react';
import { FormSection } from './FormSection';
import { FormField } from './FormField';

interface Arbitro {
    nombre_completo: string;
    correo: string;
    telefono: string;
}

interface DesignacionArbitralProps {
    tipoDesignacion: 'unico' | 'colegiado';
    setTipoDesignacion: (value: 'unico' | 'colegiado') => void;
    opcionArbitroUnico: 'propone' | 'encarga';
    setOpcionArbitroUnico: (value: 'propone' | 'encarga') => void;
    arbitros: Arbitro[];
    onChangeArbitro: (index: number, field: keyof Arbitro, value: string) => void;
}

export const DesignacionArbitral: React.FC<DesignacionArbitralProps> = ({
    tipoDesignacion,
    setTipoDesignacion,
    opcionArbitroUnico,
    setOpcionArbitroUnico,
    arbitros,
    onChangeArbitro
}) => {
    return (
        <FormSection title="Designación del órgano arbitral" number={6}>
            <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-3">Seleccione el tipo de designación:</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-3">
                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                            type="radio"
                            name="tipo_designacion"
                            checked={tipoDesignacion === 'unico'}
                            onChange={() => setTipoDesignacion('unico')}
                            className="w-4 h-4 text-[#733AEA] border-2 border-gray-300 focus:ring-2 focus:ring-purple-100"
                        />
                        <span className="text-sm font-medium text-gray-700">Árbitro Único</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                            type="radio"
                            name="tipo_designacion"
                            checked={tipoDesignacion === 'colegiado'}
                            onChange={() => setTipoDesignacion('colegiado')}
                            className="w-4 h-4 text-[#733AEA] border-2 border-gray-300 focus:ring-2 focus:ring-purple-100"
                        />
                        <span className="text-sm font-medium text-gray-700">Tribunal Arbitral Colegiado</span>
                    </label>
                </div>
            </div>

            {tipoDesignacion === 'unico' && (
                <div className="border border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50/80 to-blue-100/80 shadow-md">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Opciones para Árbitro Único
                    </h4>

                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                        <label className="flex items-start gap-3 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-blue-200">
                            <input
                                type="radio"
                                name="opcion_arbitro_unico"
                                checked={opcionArbitroUnico === 'propone'}
                                onChange={() => setOpcionArbitroUnico('propone')}
                                className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-100 mt-0.5"
                            />
                            <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">El solicitante propone el árbitro</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer p-2 sm:p-3 rounded-lg hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-blue-200">
                            <input
                                type="radio"
                                name="opcion_arbitro_unico"
                                checked={opcionArbitroUnico === 'encarga'}
                                onChange={() => setOpcionArbitroUnico('encarga')}
                                className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-100 mt-0.5"
                            />
                            <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">El solicitante encarga al CIACBLP la designación del árbitro único, conforme a su Reglamento</span>
                        </label>
                    </div>

                    {opcionArbitroUnico === 'propone' && (
                        <div className="bg-white/80 rounded-lg p-4 border border-blue-100 shadow-sm">
                            <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                                Datos del Árbitro Propuesto
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <FormField
                                    label="Nombre completo"
                                    name="arbitro_unico_nombre"
                                    value={arbitros[0]?.nombre_completo || ''}
                                    onChange={(e) => onChangeArbitro(0, 'nombre_completo', e.target.value)}
                                    placeholder="Apellidos y nombres del árbitro"
                                    required={true}
                                />
                                <FormField
                                    label="Correo electrónico (opcional)"
                                    name="arbitro_unico_correo"
                                    type="email"
                                    value={arbitros[0]?.correo || ''}
                                    onChange={(e) => onChangeArbitro(0, 'correo', e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    required={false}
                                />
                                <FormField
                                    label="Número de teléfono (opcional)"
                                    name="arbitro_unico_telefono"
                                    value={arbitros[0]?.telefono || ''}
                                    onChange={(e) => onChangeArbitro(0, 'telefono', e.target.value)}
                                    placeholder="+51 999 999 999"
                                    required={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {tipoDesignacion === 'colegiado' && (
                <div className="border border-green-200 rounded-xl p-4 bg-gradient-to-br from-green-50/80 to-green-100/80 shadow-md">
                    <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        Árbitro del Tribunal Colegiado
                    </h4>

                    <div className="bg-white/80 rounded-lg p-4 border border-green-100 shadow-sm">
                        <h5 className="text-sm font-semibold text-gray-800 flex items-center mb-3">
                            <span className="w-1 h-1 bg-green-400 rounded-full mr-2"></span>
                            Datos del Árbitro
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                label="Nombre completo"
                                name="arbitro_colegiado_nombre"
                                value={arbitros[0]?.nombre_completo || ''}
                                onChange={(e) => onChangeArbitro(0, 'nombre_completo', e.target.value)}
                                placeholder="Apellidos y nombres"
                                required={true}
                            />
                            <FormField
                                label="Correo electrónico (opcional)"
                                name="arbitro_colegiado_correo"
                                type="email"
                                value={arbitros[0]?.correo || ''}
                                onChange={(e) => onChangeArbitro(0, 'correo', e.target.value)}
                                placeholder="correo@ejemplo.com"
                                required={false}
                            />
                            <FormField
                                label="Número de teléfono (opcional)"
                                name="arbitro_colegiado_telefono"
                                value={arbitros[0]?.telefono || ''}
                                onChange={(e) => onChangeArbitro(0, 'telefono', e.target.value)}
                                placeholder="+51 999 999 999"
                                required={false}
                            />
                        </div>
                    </div>
                </div>
            )}
        </FormSection>
    );
};