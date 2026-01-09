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
            <div className="space-y-6">
                {pretensiones.map((pretension, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-gray-800">Pretensión {idx + 1}</h4>
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

                                <div className="flex gap-8 items-center mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`pretension_${idx}_tipo`}
                                            checked={pretension.determinada === true}
                                            onChange={() => onChange(idx, 'determinada', true)}
                                            className="w-5 h-5 text-[#733AEA] bg-white border-2 border-gray-300 rounded-full focus:ring-[#733AEA] focus:ring-2"
                                        />
                                        <span className="font-medium">Determinada (con cuantía específica)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`pretension_${idx}_tipo`}
                                            checked={pretension.determinada === false}
                                            onChange={() => onChange(idx, 'determinada', false)}
                                            className="w-5 h-5 text-[#733AEA] bg-white border-2 border-gray-300 rounded-full focus:ring-[#733AEA] focus:ring-2"
                                        />
                                        <span className="font-medium">Indeterminada</span>
                                    </label>
                                </div>
                            </div>

                            {pretension.determinada && (
                                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
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
                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 transition-all duration-200 font-semibold text-sm border-2 border-gray-200 hover:border-purple-300 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar otra pretensión
                </button>
            </div>
        </FormSection>
    );
};