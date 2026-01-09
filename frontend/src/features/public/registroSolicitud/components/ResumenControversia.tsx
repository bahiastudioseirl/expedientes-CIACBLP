import React from 'react';
import { FormField } from './FormField';
import { FormSection } from './FormSection';

interface ResumenControversiaProps {
    tipoResumen: 'texto' | 'archivo';
    setTipoResumen: (tipo: 'texto' | 'archivo') => void;
    resumen: string;
    archivo: File | null;
    onResumenChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onArchivoChange: (file: File | null) => void;
    error?: string;
}

export const ResumenControversia = ({
    tipoResumen,
    setTipoResumen,
    resumen,
    archivo,
    onResumenChange,
    onArchivoChange,
    error
}: ResumenControversiaProps) => {
    return (
        <FormSection title="Resumen de la controversia" number={3}>
            <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Seleccione una opción</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="tipoResumen"
                            checked={tipoResumen === 'texto'}
                            onChange={() => setTipoResumen('texto')}
                            className="w-4 h-4 text-[#733AEA] border-2 border-gray-300 focus:ring-2 focus:ring-purple-100"
                        />
                        <span className="text-sm font-medium text-gray-700">Redactar (máximo 2000 caracteres)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="tipoResumen"
                            checked={tipoResumen === 'archivo'}
                            onChange={() => setTipoResumen('archivo')}
                            className="w-4 h-4 text-[#733AEA] border-2 border-gray-300 focus:ring-2 focus:ring-purple-100"
                        />
                        <span className="text-sm font-medium text-gray-700">Subir archivo</span>
                    </label>
                </div>
            </div>
            {tipoResumen === 'texto' ? (
                <div className="form-group">
                    <FormField
                        label="Resumen detallado de la controversia"
                        name="resumen_controversia"
                        value={resumen}
                        onChange={onResumenChange}
                        isTextarea
                        maxLength={2000}
                        showCounter
                        required
                        placeholder="Describa detalladamente la controversia que motiva la solicitud de arbitraje..."
                    />
                </div>
            ) : (
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Archivo con el resumen de la controversia <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => onArchivoChange(e.target.files?.[0] || null)}
                            required
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#733AEA] hover:bg-purple-50 transition-all duration-200 bg-gray-50">
                            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-xs text-gray-600">
                                {archivo ? (
                                    <span className="font-semibold text-green-600">{archivo.name}</span>
                                ) : (
                                    <>
                                        <span className="font-semibold text-[#733AEA] hover:text-purple-700">Haga clic para seleccionar</span> o arrastre el archivo
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT hasta 10MB</p>
                        </div>
                    </div>
                    <small className="text-xs text-gray-500">Formatos permitidos: PDF, DOC, DOCX, TXT</small>
                </div>
            )}
            {error && (
                <div className="text-red-600 mt-2 text-xs">{error}</div>
            )}
        </FormSection>
    );
};
