import React from 'react';
import { FormField } from './FormField';
import { FormSection } from './FormSection';

interface Pretension {
    descripcion: string;
    determinada: boolean;
    cuantia: number | null;
}

interface PretensionesFormProps {
    pretensiones: Pretension[];
    onChange: (index: number, field: string, value: any) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

export const PretensionesForm = ({
    pretensiones,
    onChange,
    onAdd,
    onRemove
}: PretensionesFormProps) => {
    return (
        <FormSection number={4} title="Pretensiones">
            <div className="space-y-4 sm:space-y-6">
                {pretensiones.map((pretension, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-0">Pretensión {idx + 1}</h4>
                            {idx > 0 && (
                                <button
                                    type="button"
                                    onClick={() => onRemove(idx)}
                                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2"
                                    title="Eliminar pretensión"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <FormField
                                label="Descripción de la pretensión"
                                name={`pretension_${idx}_descripcion`}
                                value={pretension.descripcion}
                                onChange={(e) => onChange(idx, 'descripcion', e.target.value)}
                                isTextarea
                                placeholder="Ej: La carta numero 50 donde se me coloque la penalidad quede sin efecto"
                                required
                            />

                            <div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 items-start sm:items-center mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`pretension_${idx}_tipo`}
                                            checked={pretension.determinada === true}
                                            onChange={() => onChange(idx, 'determinada', true)}
                                            className="w-4 h-4 text-[#733AEA] border-2 border-gray-300 focus:ring-2 focus:ring-purple-100"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Determinada (con cuantía específica)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`pretension_${idx}_tipo`}
                                            checked={pretension.determinada === false}
                                            onChange={() => onChange(idx, 'determinada', false)}
                                            className="w-4 h-4 text-[#733AEA] border-2 border-gray-300 focus:ring-2 focus:ring-purple-100"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Indeterminada</span>
                                    </label>
                                </div>
                            </div>

                            {pretension.determinada && (
                                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl">
                                    <FormField
                                        label="Cuantía (S/.)"
                                        name={`pretension_${idx}_cuantia`}
                                        type="number"
                                        value={pretension.cuantia?.toString() || ''}
                                        onChange={(e) => onChange(idx, 'cuantia', e.target.value ? parseFloat(e.target.value) : null)}
                                        placeholder="0.00"
                                        required={pretension.determinada}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={onAdd}
                    className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 transition-all duration-200 font-semibold text-xs sm:text-sm border-2 border-gray-200 hover:border-purple-300 flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar otra pretensión
                </button>
            </div>
        </FormSection>
    );
};