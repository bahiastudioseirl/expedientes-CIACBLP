import { Edit, Plus, Search, FileText, Building, CheckCircle, XCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ModalAgregar from "../components/ModalAgregar";
import ModalEditar from "../components/ModalEditar";
import { crearPlantilla } from "../services/crearPlantilla";
import { obtenerPlantillas } from "../services/obtenerPlantillas";
import { actualizarPlantilla, cambiarEstadoPlantilla } from "../services/actualizarPlantilla";
import type { CrearPlantillaRequest, ActualizarPlantillaRequest, Plantilla } from "../schemas/PlantillaSchema";

export default function PlantillaAdmin() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [plantillaEditar, setPlantillaEditar] = useState<Plantilla | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        cargarPlantillas();
    }, []);

    const cargarPlantillas = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await obtenerPlantillas();
            const plantillasOrdenadas = response.data.plantillas.sort((a, b) => a.id_plantilla - b.id_plantilla);
            setPlantillas(plantillasOrdenadas);
        } catch (err: any) {
            console.error("Error al cargar plantillas:", err);
            console.error("Response data:", err?.response?.data);
            const msg = err?.response?.data?.message || "Error al cargar las plantillas";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(
        () => {
            const filtered = plantillas.filter(
                (plantilla) =>
                    plantilla.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return filtered;
        },
        [plantillas, searchTerm]
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSavePlantilla = async (data: CrearPlantillaRequest) => {
        setSaving(true);
        setError("");
        try {
            const response = await crearPlantilla(data);

            if (response.success) {
                setPlantillas((prev) => {
                    const nuevaLista = [...prev, response.data.plantilla].sort((a, b) => a.id_plantilla - b.id_plantilla);
                    return nuevaLista;
                });
                setIsModalOpen(false);
            }
        } catch (err: any) {
            console.error("Error al crear plantilla:", err);
            console.error("Response data:", err?.response?.data);
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "No se pudo crear la plantilla.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleEditClick = (plantilla: Plantilla) => {
        setPlantillaEditar(plantilla);
        setIsEditModalOpen(true);
    };

    const handleUpdatePlantilla = async (id: number, data: ActualizarPlantillaRequest) => {
        setSaving(true);
        setError("");
        try {
            const response = await actualizarPlantilla(id, data);

            if (response.success) {
                setPlantillas((prev) =>
                    prev.map((plant) => (plant.id_plantilla === id ? response.data.plantilla : plant))
                        .sort((a, b) => a.id_plantilla - b.id_plantilla)
                );
                setIsEditModalOpen(false);
                setPlantillaEditar(null);
            }
        } catch (err: any) {
            console.error("Error al actualizar plantilla:", err);
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "No se pudo actualizar la plantilla.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleCambiarEstado = async (id: number, nuevoEstado: boolean) => {
        setError("");
        try {
            const response = await cambiarEstadoPlantilla(id);

            if (response.success) {
                setPlantillas((prev) =>
                    prev.map((plant) => 
                        plant.id_plantilla === id 
                            ? { ...plant, activo: nuevoEstado }
                            : plant
                    ).sort((a, b) => a.id_plantilla - b.id_plantilla)
                );
            }
        } catch (err: any) {
            console.error("Error al cambiar estado de plantilla:", err);
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "No se pudo cambiar el estado de la plantilla.";
            setError(msg);
        }
    };
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border shadow-sm rounded-xl border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-[#733AEA]/20">
                                <Building className="w-6 h-6 text-[#733AEA]-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Gestión de Plantillas</h1>
                                <p className="mt-1 text-slate-600">Administra las plantillas para tus expedientes</p>
                            </div>
                        </div>
                        <button
                            onClick={openModal}
                            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nueva plantilla</span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                                <input
                                    placeholder="Buscar por nombre..."
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
                        <p className="text-sm text-slate-600">Cargando plantillas...</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="border-b bg-slate-50 border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Nombre</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Etapas</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Estado</th>
                                    <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <FileText className="w-12 h-12 mb-3" />
                                                <p className="text-sm font-medium">No se encontraron plantillas</p>
                                                <p className="text-xs mt-1">
                                                    {searchTerm ? "Intenta con otro término de búsqueda" : "Agrega tu primera plantilla"}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((plantilla) => (
                                        <tr key={plantilla.id_plantilla} className="transition-colors hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 text-center">#{plantilla.id_plantilla}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">{plantilla.nombre}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 text-center">
                                                {plantilla.etapas?.length || 0} etapas
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                                                    plantilla.activo ? 
                                                        'bg-green-100 text-green-800' : 
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                    {plantilla.activo ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Activo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Inactivo
                                                        </>
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleEditClick(plantilla)}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCambiarEstado(plantilla.id_plantilla, !plantilla.activo)}
                                                        className={`p-2 rounded-lg transition-colors duration-200 ${
                                                            plantilla.activo 
                                                                ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                                                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                                        }`}
                                                        title={plantilla.activo ? "Desactivar" : "Activar"}
                                                    >
                                                        {plantilla.activo ? (
                                                            <ToggleLeft className="w-4 h-4" />
                                                        ) : (
                                                            <ToggleRight className="w-4 h-4" />
                                                        )}
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
                                    <span className="font-medium">{filteredData.length}</span> plantillas
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
                onSave={handleSavePlantilla}
                loading={saving}
            />

            {/* Modal Editar */}
            <ModalEditar
                open={isEditModalOpen}
                plantilla={plantillaEditar}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setPlantillaEditar(null);
                }}
                onSave={handleUpdatePlantilla}
                loading={saving}
            />
        </div>
    );
}
