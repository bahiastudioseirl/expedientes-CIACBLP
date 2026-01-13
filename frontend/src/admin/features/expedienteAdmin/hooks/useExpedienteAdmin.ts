import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { obtenerExpedientes } from '../services/obtenerExpedientes';
import type { Expediente } from '../schemas/ExpedienteSchema';

export function useExpedienteAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados de modales
  const [isModalDesdeSolicitud, setIsModalDesdeSolicitud] = useState(false);
  const [idSolicitudParaExpediente, setIdSolicitudParaExpediente] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFlujoModalOpen, setIsFlujoModalOpen] = useState(false);
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  
  // Estados de datos
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const itemsPerPage = 10;

  // Detectar si viene desde solicitud
  useEffect(() => {
    const crearDesdeSolicitud = searchParams.get('crearDesdeSolicitud');
    if (crearDesdeSolicitud) {
      const idSolicitud = parseInt(crearDesdeSolicitud, 10);
      if (!isNaN(idSolicitud)) {
        setIdSolicitudParaExpediente(idSolicitud);
        setIsModalDesdeSolicitud(true);
        searchParams.delete('crearDesdeSolicitud');
        setSearchParams(searchParams);
      }
    }
  }, [searchParams, setSearchParams]);

  // Cargar expedientes al montar
  useEffect(() => {
    cargarExpedientes();
  }, []);

  // Reset page cuando cambia búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const cargarExpedientes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await obtenerExpedientes();
      if (response.success) {
        const expedientesOrdenados = response.data.expedientes.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        setExpedientes(expedientesOrdenados);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al cargar los expedientes";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredData = useMemo(() => {
    return expedientes.filter(expediente =>
      expediente.codigo_expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expediente.demandante[0]?.nombre_razon || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expediente.demandado[0]?.nombre_razon || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expedientes, searchTerm]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return { totalPages, startIndex, endIndex, paginatedData };
  }, [filteredData, currentPage, itemsPerPage]);

  const handleViewExpediente = useCallback((expediente: Expediente) => {
    setSelectedExpediente(expediente);
    setIsViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setSelectedExpediente(null);
  }, []);

  const handleOpenFlujoModal = useCallback((expediente: Expediente) => {
    setSelectedExpediente(expediente);
    setIsFlujoModalOpen(true);
  }, []);

  const handleCloseFlujoModal = useCallback(() => {
    setIsFlujoModalOpen(false);
    setSelectedExpediente(null);
  }, []);

  const handleCloseModalDesdeSolicitud = useCallback(() => {
    setIsModalDesdeSolicitud(false);
    setIdSolicitudParaExpediente(null);
  }, []);

  const handleSuccessCrearExpediente = useCallback(() => {
    cargarExpedientes();
  }, [cargarExpedientes]);

  const getNombreDemandante = useCallback((expediente: Expediente) => {
    return expediente.demandante[0]?.nombre_razon || 'N/A';
  }, []);

  const getNombreDemandado = useCallback((expediente: Expediente) => {
    return expediente.demandado[0]?.nombre_razon || 'N/A';
  }, []);

  return {
    // Estados
    expedientes: filteredData,
    paginatedData: paginationData.paginatedData,
    searchTerm,
    currentPage,
    loading,
    error,
    selectedExpediente,
    
    // Modales
    isModalDesdeSolicitud,
    idSolicitudParaExpediente,
    isViewModalOpen,
    isFlujoModalOpen,
    
    // Paginación
    totalPages: paginationData.totalPages,
    startIndex: paginationData.startIndex,
    endIndex: paginationData.endIndex,
    itemsPerPage,
    
    // Acciones
    setSearchTerm,
    setCurrentPage,
    cargarExpedientes,
    handleViewExpediente,
    handleCloseViewModal,
    handleOpenFlujoModal,
    handleCloseFlujoModal,
    handleCloseModalDesdeSolicitud,
    handleSuccessCrearExpediente,
    getNombreDemandante,
    getNombreDemandado,
  };
}
