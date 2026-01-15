import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    MessageSquare,
    CheckCircle,
    XCircle,
    Lock,
    Eye,
    ToggleLeft,
    ToggleRight,
    Plus,
    X
} from 'lucide-react';
import { obtenerAsuntosPorExpediente } from '../services/obtenerAsuntos';
import { cambiarEstadoAsunto } from '../services/mensajesService';
import { crearAsunto } from '../services/crearAsunto';
import { AuthStore } from '../../../core/components/auth/services/AuthStore';
import type { ExpedienteAsignado, Asunto } from '../schemas/BandejaEntradaSchema';

interface ListaAsuntosProps {
    expediente: ExpedienteAsignado;
    onBack: () => void;
    onSelectAsunto: (asunto: Asunto) => void;
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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newAsuntoTitle, setNewAsuntoTitle] = useState('');
    
    const currentUser = AuthStore.getUser();
    const esAdministrador = currentUser?.rol === 'Administrador';

    useEffect(() => {
        cargarAsuntos();
    }, [expediente.id]);

    const cargarAsuntos = async () => {
        if (!expediente?.id) {
            console.error('No hay id disponible:', expediente);
            setError('ID de expediente no disponible');
            setLoading(false);
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            const response = await obtenerAsuntosPorExpediente(expediente.id);
            if (response.success) {
                setAsuntos(response.data.asuntos);
            } else {
                setError('No se pudieron cargar los asuntos');
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

    const handleCreateAsunto = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newAsuntoTitle.trim()) {
            setError('El título del asunto es obligatorio');
            return;
        }

        setCreating(true);
        setError('');
        
        try {
            const response = await crearAsunto({
                id_expediente: expediente.id,
                titulo: newAsuntoTitle.trim()
            });
            
            if (response.success) {
                // Agregar el nuevo asunto a la lista
                setAsuntos(prevAsuntos => [response.data.asunto, ...prevAsuntos]);
                setNewAsuntoTitle('');
                setShowCreateModal(false);
            }
        } catch (err: any) {
            console.error('Error al crear asunto:', err);
            const msg = err?.response?.data?.message || 'Error al crear el asunto';
            setError(msg);
        } finally {
            setCreating(false);
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
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
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
                        
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Crear Asunto</span>
                            <span className="sm:hidden">Crear</span>
                        </button>
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
                    asuntos.map((asunto) => {
                        // Extraer etapa y sub_etapa si existen
                        const etapa = asunto.flujo?.etapa;
                        const subEtapa = etapa?.sub_etapa;
                        return (
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
                                                {/* Mostrar etapa y subetapa si existen */}
                                                {etapa && (
                                                    <div className="mt-1 text-xs text-slate-600">
                                                        <span>Etapa: <span className="font-medium">{etapa.nombre}</span></span>
                                                        {subEtapa && (
                                                            <span> &nbsp;|&nbsp; Subetapa: <span className="font-medium">{subEtapa.nombre}</span></span>
                                                        )}
                                                    </div>
                                                )}
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
                                                {esAdministrador && (
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
                                                )}
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
                        );
                    })
                )}
            </div>
            {/* Modal para crear asunto */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => {
                        setShowCreateModal(false);
                        setNewAsuntoTitle('');
                        setError('');
                    }} />
                    <div className="relative z-51 bg-white rounded-xl shadow-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">Crear Nuevo Asunto</h3>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setNewAsuntoTitle('');
                                    setError('');
                                }}
                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateAsunto} className="p-6">
                            <div className="mb-4">
                                <label htmlFor="titulo" className="block text-sm font-medium text-slate-700 mb-2">
                                    Título del Asunto
                                </label>
                                <input
                                    type="text"
                                    id="titulo"
                                    value={newAsuntoTitle}
                                    onChange={(e) => setNewAsuntoTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ingrese el título del asunto..."
                                    maxLength={255}
                                    disabled={creating}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {newAsuntoTitle.length}/255 caracteres
                                </p>
                            </div>
                            
                            {error && (
                                <div className="mb-4 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}
                            
                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setNewAsuntoTitle('');
                                        setError('');
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    disabled={creating}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating || !newAsuntoTitle.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {creating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Creando...</span>
                                        </>
                                    ) : (
                                        <span>Crear Asunto</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}        </div>
    );
}