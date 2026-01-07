import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    FileText,
    Eye,
    Calendar,
    Building2,
    Users,
    ChevronRight
} from 'lucide-react';
import { obtenerExpedientesAsignados } from '../services/obtenerExpedientesAsignados';
import type { ExpedienteAsignado } from '../schemas/BandejaEntradaSchema';

interface BandejaEntradaProps {
    onSelectExpediente: (expediente: ExpedienteAsignado) => void;
    currentUser?: {
        id_usuario: number;
        id_rol: number;
        nombre: string;
        apellido?: string;
    };
    userRole?: number;
}

export default function BandejaEntrada({
    onSelectExpediente,
    currentUser,
    userRole
}: BandejaEntradaProps) {
    const [expedientes, setExpedientes] = useState<ExpedienteAsignado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        cargarExpedientesAsignados();
    }, []);

    const cargarExpedientesAsignados = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerExpedientesAsignados();
            if (response.success) {
                const expedientesOrdenados = response.data.expedientes.sort((a, b) => {
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateB - dateA;
                });
                setExpedientes(expedientesOrdenados);
            }
        } catch (err: any) {
            console.error('Error al cargar expedientes asignados:', err);
            const msg = err?.response?.data?.message || 'Error al cargar los expedientes asignados';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        return expedientes.filter(expediente =>
            expediente.codigo_expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (expediente.asunto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (expediente.plantilla.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [expedientes, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const getRolParticipante = (participantes: any[], rol: string) => {
        const participante = participantes.find(p =>
            p.usuario?.rol_nombre?.toLowerCase().includes(rol.toLowerCase())
        );
        if (!participante) return "N/A";
        return participante.usuario.nombre_empresa
            ? participante.usuario.nombre_empresa
            : `${participante.usuario.nombre || ''} ${participante.usuario.apellido || ''}`.trim();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-sm text-slate-600">Cargando expedientes asignados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="p-4 sm:p-6 border-b border-slate-200">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-violet-50">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Bandeja de Entrada</h1>
                            <p className="mt-1 text-sm text-slate-600 hidden sm:block">Expedientes asignados a ti</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="flex-1 max-w-full lg:max-w-md">
                            <div className="relative">
                                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                                <input
                                    placeholder="Buscar expedientes asignados..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
                            <span className="font-medium text-slate-700">{filteredData.length}</span>
                            <span className="ml-1 text-slate-500">expedientes</span>
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

            {/* Lista de expedientes */}
            <div className="space-y-4">
                {filteredData.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No hay expedientes asignados</h3>
                        <p className="text-slate-600">
                            {searchTerm ? "No se encontraron expedientes que coincidan con tu búsqueda." : "No tienes expedientes asignados en este momento."}
                        </p>
                    </div>
                ) : (
                    paginatedData.map((expediente) => (
                        <div
                            key={expediente.id_expediente}
                            className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => onSelectExpediente(expediente)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                Caso arbitral N° {expediente.codigo_expediente}
                                            </h3>
                                            {expediente.participantes && (
                                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                                    {getRolParticipante(expediente.participantes, "demandante")} vs. {getRolParticipante(expediente.participantes, "demandado")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 ml-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${expediente.activo
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {expediente.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Paginación */}
            {
                filteredData.length > 0 && totalPages > 1 && (
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="text-sm text-slate-600 text-center sm:text-left">
                                Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                                <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> de{" "}
                                <span className="font-medium">{filteredData.length}</span> expedientes
                            </div>
                            <div className="flex justify-center sm:justify-end space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <span className="flex items-center px-3 py-1.5 text-sm text-slate-600">
                                    {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}