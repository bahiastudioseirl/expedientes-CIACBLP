import { Edit, Plus, Search, FileText, Building } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ModalAgregar from "../components/ModalAgregar";
import ModalEditar from "../components/ModalEditar";
import { crearEmpresa } from "../services/crearEmpresa";
import { obtenerEmpresas } from "../services/obtenerEmpresas";
import { actualizarEmpresa } from "../services/actualizarEmpresa";
import type { CrearEmpresaRequest, Empresa } from "../schemas/EmpresaSchema";

export default function EmpresaAdmin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [empresaEditar, setEmpresaEditar] = useState<Empresa | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        cargarEmpresas();
    }, []);

    const cargarEmpresas = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await obtenerEmpresas();
            const empresasOrdenadas = response.data.sort((a, b) => a.id_empresa - b.id_empresa);
            setEmpresas(empresasOrdenadas);
        } catch (err: any) {
            console.error("Error al cargar empresas:", err);
            console.error("Response data:", err?.response?.data);
            const msg = err?.response?.data?.message || "Error al cargar las empresas";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(
        () => {
            const filtered = empresas.filter(
                (empresa) =>
                    empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return filtered;
        },
        [empresas, searchTerm]
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSaveEmpresa = async (data: { nombre: string }) => {
        setSaving(true);
        setError("");
        try {
            const payload: CrearEmpresaRequest = { nombre: data.nombre };
            const response = await crearEmpresa(payload);

            if (response.success) {
                setEmpresas((prev) => {
                    const nuevaLista = [...prev, response.data.empresa].sort((a, b) => a.id_empresa - b.id_empresa);
                    return nuevaLista;
                });
                setIsModalOpen(false);
            }
        } catch (err: any) {
            console.error("Error al crear empresa:", err);
            console.error("Response data:", err?.response?.data);
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "No se pudo crear la empresa.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleEditClick = (empresa: Empresa) => {
        setEmpresaEditar(empresa);
        setIsEditModalOpen(true);
    };

    const handleUpdateEmpresa = async (id: number, data: { nombre: string }) => {
        setSaving(true);
        setError("");
        try {
            const payload: CrearEmpresaRequest = { nombre: data.nombre };
            const response = await actualizarEmpresa(id, payload);

            if (response.success) {
                setEmpresas((prev) =>
                    prev.map((emp) => (emp.id_empresa === id ? response.data.empresa : emp))
                        .sort((a, b) => a.id_empresa - b.id_empresa)
                );
                setIsEditModalOpen(false);
                setEmpresaEditar(null);
            }
        } catch (err: any) {
            console.error("Error al actualizar empresa:", err);
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "No se pudo actualizar la empresa.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-red-50">
                                <Building className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Gestión de Empresas</h1>
                                <p className="mt-1 text-slate-600">Administra empresas y responsables</p>
                            </div>
                        </div>
                        <button
                            onClick={openModal}
                            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nueva empresa</span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                                <input
                                    placeholder="Buscar por empresa o responsable..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2.5 pl-10 pr-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex items-center px-3 py-2 text-sm border rounded-lg bg-slate-50 border-slate-200">
                            <span className="font-medium text-slate-700">{filteredData.length}</span>
                            <span className="ml-1 text-slate-500">registros</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Errores globales */}
            {error && (
                <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {/* Estado de carga */}
            {loading ? (
                <div className="flex items-center justify-center py-12 bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        <p className="text-sm text-slate-600">Cargando empresas...</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="border-b bg-slate-50 border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Empresa</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Fecha Creación</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <FileText className="w-12 h-12 mb-3" />
                                                <p className="text-sm font-medium">No se encontraron empresas</p>
                                                <p className="text-xs mt-1">
                                                    {searchTerm ? "Intenta con otro término de búsqueda" : "Agrega tu primera empresa"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((empresa) => (
                                        <tr key={empresa.id_empresa} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 text-center">{empresa.id_empresa}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">{empresa.nombre}</td>
                                            <td className="px-6 py-4 text-sm text-slate-800 text-center">
                                                {new Date(empresa.created_at).toLocaleDateString('es-PE', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleEditClick(empresa)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>


                                    ))

                                )}
                            </tbody>

                        </table>
                        {/* Paginación */}
                        {filteredData.length > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                                <div className="text-sm text-slate-600">
                                    Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                                    <span className="font-medium">{Math.min(endIndex, filteredData.length)}</span> de{" "}
                                    <span className="font-medium">{filteredData.length}</span> cursos
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${currentPage === page
                                                        ? "bg-[#132436] text-white"
                                                        : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Agregar */}
            <ModalAgregar
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEmpresa}
                loading={saving}
            />

            {/* Modal Editar */}
            <ModalEditar
                open={isEditModalOpen}
                empresa={empresaEditar}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEmpresaEditar(null);
                }}
                onSave={handleUpdateEmpresa}
                loading={saving}
            />
        </div>
    );
}
