import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    MessageSquare,
    Calendar,
    CheckCircle,
    XCircle,
    Lock,
    Eye,
    Settings,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { obtenerAsuntosPorExpediente } from '../services/obtenerAsuntos';
import { cambiarEstadoAsunto } from '../services/mensajesService';
import type { ExpedienteAsignado, Asunto } from '../schemas/BandejaEntradaSchema';

interface ListaAsuntosProps {
    expediente: ExpedienteAsignado;
    onBack: () => void;
    onSelectAsunto: (asunto: Asunto) => void;
    currentUser?: {
        id_usuario: number;
        id_rol: number;
        nombre: string;
        apellido?: string;
    };
    userRole?: number; 
}

export default function ListaAsuntos({
    expediente,
    onBack,
    onSelectAsunto,
}: ListaAsuntosProps) {
    const [asuntos, setAsuntos] = useState<Asunto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toggling, setToggling] = useState<number | null>(null);

    useEffect(() => {
        cargarAsuntos();
    }, [expediente.id_expediente]);

    const cargarAsuntos = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerAsuntosPorExpediente(expediente.id_expediente);
            if (response.success) {
                setAsuntos(response.data.asuntos);
            }
        } catch (err: any) {
            console.error('Error al cargar asuntos:', err);
            const msg = err?.response?.data?.message || 'Error al cargar los asuntos';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAsunto = async (asunto: Asunto, e: React.MouseEvent) => {
        e.stopPropagation(); // Evitar que se active el click del asunto
        
        setToggling(asunto.id_asunto);
        try {
            const response = await cambiarEstadoAsunto(asunto.id_asunto);
            if (response.success) {
                // Actualizar el estado local del asunto
                setAsuntos(prevAsuntos => 
                    prevAsuntos.map(a => 
                        a.id_asunto === asunto.id_asunto 
                            ? { ...a, activo: !a.activo }
                            : a
                    )
                );
            }
        } catch (err: any) {
            console.error('Error al cambiar estado del asunto:', err);
            const msg = err?.response?.data?.message || 'Error al cambiar el estado del asunto';
            setError(msg);
        } finally {
            setToggling(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900">Cargando asuntos...</h1>
                </div>
                <div className="flex items-center justify-center py-12 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        <p className="text-sm text-slate-600">Cargando asuntos del expediente...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header con botón de regreso */}
            <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 mb-3">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-green-50">
                                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Asuntos del Expediente
                                </h1>
                                <p className="text-sm text-slate-600">
                                    {expediente.codigo_expediente}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {/* Lista de asuntos */}
            <div className="space-y-4">
                {asuntos.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No hay asuntos</h3>
                        <p className="text-slate-600">Este expediente no tiene asuntos registrados aún.</p>
                    </div>
                ) : (
                    asuntos.map((asunto) => (
                        <div
                            key={asunto.id_asunto}
                            className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => onSelectAsunto(asunto)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${asunto.activo
                                                    ? 'bg-green-100'
                                                    : 'bg-red-100'
                                                }`}>
                                                {asunto.activo ? (
                                                    <MessageSquare className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Lock className="w-4 h-4 text-red-600" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-light text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {asunto.titulo}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 ml-4">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${asunto.activo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {asunto.activo ? (
                                                <span className="flex items-center space-x-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    <span>Activo</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center space-x-1">
                                                    <XCircle className="w-3 h-3" />
                                                    <span>Cerrado</span>
                                                </span>
                                            )}
                                        </span>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={(e) => handleToggleAsunto(asunto, e)}
                                                disabled={toggling === asunto.id_asunto}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    asunto.activo 
                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                } ${toggling === asunto.id_asunto ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title={asunto.activo ? 'Cerrar asunto' : 'Abrir asunto'}
                                            >
                                                {toggling === asunto.id_asunto ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : asunto.activo ? (
                                                    <ToggleRight className="w-4 h-4" />
                                                ) : (
                                                    <ToggleLeft className="w-4 h-4" />
                                                )}
                                            </button>
                                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                                <Eye className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!asunto.activo && (
                                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs text-amber-800 flex items-center space-x-1">
                                        <Lock className="w-3 h-3" />
                                        <span>Este asunto está cerrado. No se pueden enviar nuevos mensajes.</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}