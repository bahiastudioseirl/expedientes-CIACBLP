import { useState, useEffect } from 'react';
import { RegistroSolicitudRequest } from '../schemas/RegistroSolicitudSchema';
import { DemandanteForm } from './DemandanteForm';
import { DemandadoForm } from './DemandadoForm';
import { ResumenControversia } from './ResumenControversia';
import { PretensionesForm } from './PretensionesForm';
import { MedidaCautelar } from './MedidaCautelar';
import { DesignacionArbitral } from './DesignacionArbitral';
import { LinkAnexo } from './LinkAnexo';
import { SuccessModal } from '../../../../components/common/SuccessModal';

interface Props {
    onSubmit: (data: RegistroSolicitudRequest) => void;
    loading?: boolean;
    error?: string;
    showSuccessModal?: boolean;
    successMessage?: string;
    onCloseSuccessModal?: () => void;
    setError?: (msg: string) => void;
}

export const RegistroSolicitudForm = ({ 
    onSubmit, 
    loading = false, 
    error = '', 
    showSuccessModal = false,
    successMessage = '',
    onCloseSuccessModal,
    setError 
}: Props) => {
    const [form, setForm] = useState<RegistroSolicitudRequest>({
        demandante: { nombre_razon: '', numero_documento: '', telefono: '' },
        correos_demandante: [{ correo: '', es_principal: true }],
        representante_demandante: { nombre_completo: '', numero_documento: '', telefono: '' },
        demandado: { nombre_razon: '', numero_documento: '', telefono: '' },
        correos_demandado: [{ correo: '', es_principal: true }],
        representante_demandado: { nombre_completo: '', numero_documento: '', telefono: '' },
        demandado_extra: { mesa_partes_virtual: false, direccion_fiscal: '' },
        resumen_controversia: '',
        resumen_controversia_tipo: 'texto',
        resumen_controversia_archivo: null,
        pretensiones: [{ descripcion: '', determinada: true, cuantia: null }],
        medida_cautelar: '',
        designacion: { arbitro_unico: false, propone_arbitro: false, encarga_ciacblp: false },
        arbitros: [{ nombre_completo: '', correo: '', telefono: '' }],
        link_anexo: ''
    });

    // Estados para opciones del resumen
    const [tipoResumen, setTipoResumen] = useState<'texto' | 'archivo'>('texto');
    
    // Estados para designación de árbitro
    const [tipoDesignacion, setTipoDesignacion] = useState<'unico' | 'colegiado'>('unico');
    const [opcionArbitroUnico, setOpcionArbitroUnico] = useState<'propone' | 'encarga'>('encarga');

    // Sincronizar designación con el formulario
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            designacion: {
                arbitro_unico: tipoDesignacion === 'unico',
                propone_arbitro: tipoDesignacion === 'unico' && opcionArbitroUnico === 'propone',
                encarga_ciacblp: tipoDesignacion === 'unico' && opcionArbitroUnico === 'encarga'
            },
            // No enviar árbitros cuando se encarga al CIACBLP
            arbitros: opcionArbitroUnico === 'encarga' ? [] : (prev.arbitros.length === 0 ? [{ nombre_completo: '', correo: '', telefono: '' }] : prev.arbitros)
        }));
    }, [tipoDesignacion, opcionArbitroUnico]);

    // Handlers para campos simples
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let checked = false;
        if (type === 'checkbox' && 'checked' in e.target) {
            checked = (e.target as HTMLInputElement).checked;
        }
        if (name.includes('.')) {
            const [group, field] = name.split('.');
            setForm(prev => {
                const groupValue = typeof prev[group as keyof RegistroSolicitudRequest] === 'object' && prev[group as keyof RegistroSolicitudRequest] !== null
                    ? prev[group as keyof RegistroSolicitudRequest] as Record<string, any>
                    : {};
                return {
                    ...prev,
                    [group]: { ...groupValue, [field]: type === 'checkbox' ? checked : value }
                };
            });
        } else {
            setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
        if (error && setError) setError('');
    };

    // Handlers para arrays con lógica automática de correo principal
    const handleArrayChange = (arrName: keyof RegistroSolicitudRequest, idx: number, field: string, value: any) => {
        setForm(prev => {
            const newArray = Array.isArray(prev[arrName]) ? prev[arrName].map((item: any, i: number) => {
                if (i === idx) {
                    return { ...item, [field]: value };
                }
                return item;
            }) : prev[arrName];

            return { ...prev, [arrName]: newArray };
        });
        if (error && setError) setError('');
    };

    const addArrayItem = (arrName: keyof RegistroSolicitudRequest, item: any) => {
        setForm(prev => ({
            ...prev,
            [arrName]: Array.isArray(prev[arrName]) ? [...prev[arrName], item] : [item]
        }));
    };

    const removeArrayItem = (arrName: keyof RegistroSolicitudRequest, idx: number) => {
        setForm(prev => ({
            ...prev,
            [arrName]: Array.isArray(prev[arrName]) ? prev[arrName].filter((_: any, i: number) => i !== idx) : []
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Marcar automáticamente el primer correo como principal
        const formWithCorreos = {
            ...form,
            correos_demandante: form.correos_demandante.map((correo, idx) => ({
                ...correo,
                es_principal: idx === 0
            })),
            correos_demandado: form.correos_demandado.map((correo, idx) => ({
                ...correo,
                es_principal: idx === 0
            }))
        };
        onSubmit(formWithCorreos);
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-white px-4 sm:px-6 lg:px-8">
            <div className="py-4 sm:py-6">
                {/* Título Principal */}
                <div className="text-center mb-6 sm:mb-12">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Solicitud de Arbitraje</h1>
                    <p className="text-xs sm:text-sm text-gray-600">Complete el siguiente formulario con la información requerida</p>
                    <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#733AEA] to-purple-600 mx-auto mt-3 rounded-full"></div>
                </div>

                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                    {/* Datos del Demandante */}
                    <DemandanteForm
                        demandante={form.demandante}
                        correos={form.correos_demandante}
                        representante={form.representante_demandante}
                        onChange={(field, value) => {
                            if (field.startsWith('correos_demandante.')) {
                                const [, index, property] = field.split('.');
                                handleArrayChange('correos_demandante', parseInt(index), property, value);
                            } else {
                                const e = { target: { name: field, value } } as React.ChangeEvent<HTMLInputElement>;
                                handleChange(e);
                            }
                        }}
                        onAddCorreo={() => addArrayItem('correos_demandante', { correo: '', es_principal: false })}
                        onRemoveCorreo={(index) => removeArrayItem('correos_demandante', index)}
                    />

                    {/* Datos del Demandado */}
                    <DemandadoForm
                        demandado={form.demandado}
                        correos={form.correos_demandado}
                        representante={form.representante_demandado}
                        demandadoExtra={form.demandado_extra}
                        onChange={(field, value) => {
                            if (field.startsWith('correos_demandado.')) {
                                const [, index, property] = field.split('.');
                                handleArrayChange('correos_demandado', parseInt(index), property, value);
                            } else {
                                const e = { target: { name: field, value, type: typeof value === 'boolean' ? 'checkbox' : 'text', checked: value } } as React.ChangeEvent<HTMLInputElement>;
                                handleChange(e);
                            }
                        }}
                        onAddCorreo={() => addArrayItem('correos_demandado', { correo: '', es_principal: false })}
                        onRemoveCorreo={(index) => removeArrayItem('correos_demandado', index)}
                    />

                    {/* Resumen de la controversia */}
                    <ResumenControversia
                        tipoResumen={tipoResumen}
                        setTipoResumen={(tipo) => {
                            setTipoResumen(tipo);
                            setForm(prev => ({
                                ...prev,
                                resumen_controversia_tipo: tipo,
                                resumen_controversia: tipo === 'archivo' ? '' : prev.resumen_controversia,
                                resumen_controversia_archivo: tipo === 'texto' ? null : prev.resumen_controversia_archivo
                            }));
                        }}
                        resumen={form.resumen_controversia}
                        archivo={form.resumen_controversia_archivo}
                        onResumenChange={e => {
                            setForm(prev => ({ ...prev, resumen_controversia: e.target.value }));
                            if (error && setError) setError('');
                        }}
                        onArchivoChange={(file) => {
                            setForm(prev => ({ ...prev, resumen_controversia_archivo: file }));
                            if (error && setError) setError('');
                        }}
                        error={error}
                    />

                    {/* Pretensiones */}
                    <PretensionesForm
                        pretensiones={form.pretensiones}
                        onChange={(index, field, value) => handleArrayChange('pretensiones', index, field, value)}
                        onAdd={() => addArrayItem('pretensiones', { descripcion: '', determinada: true, cuantia: null })}
                        onRemove={(index) => removeArrayItem('pretensiones', index)}
                    />

                    <MedidaCautelar
                        medida_cautelar={form.medida_cautelar}
                        onChange={handleChange}
                    />

                    <DesignacionArbitral
                        tipoDesignacion={tipoDesignacion}
                        setTipoDesignacion={setTipoDesignacion}
                        opcionArbitroUnico={opcionArbitroUnico}
                        setOpcionArbitroUnico={setOpcionArbitroUnico}
                        arbitros={form.arbitros}
                        onChangeArbitro={(index, field, value) => handleArrayChange('arbitros', index, field, value)}
                    />

                    {/* Link de anexo */}
                    <LinkAnexo
                        link_anexo={form.link_anexo}
                        onChange={handleChange}
                    />

                    {/* Mensajes de error */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal de éxito */}
                    <SuccessModal
                        isOpen={showSuccessModal}
                        onClose={onCloseSuccessModal || (() => {})}
                        message={successMessage || "Su solicitud ha sido procesada correctamente."}
                        countdown={10}
                    />

                    {/* Botón de envío */}
                    <div className="text-center pt-4 sm:pt-6">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#733AEA] to-purple-600 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-[#733AEA] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-0 sm:min-w-[240px]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Enviando solicitud...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Enviar Solicitud de Arbitraje</span>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
