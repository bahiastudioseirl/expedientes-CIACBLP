import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  UserCog, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  FileText, 
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Edit,
  ToggleLeft,
  ToggleRight,
  User
} from 'lucide-react';
import type { Usuario, ListarUsuariosResponse } from '../schemas/UsuarioSchema';
import { cambiarEstadoUsuario } from '../services/usuariosService';

interface ListaUsuariosProps {
  titulo: string;
  tipoUsuario: 'administradores' | 'secretarios' | 'demandantes' | 'demandados' | 'arbitros';
  icono: React.ComponentType<any>;
  obtenerUsuarios: () => Promise<ListarUsuariosResponse>;
  onCrear?: () => void;
  modalCrear?: React.ReactNode;
  onUsuarioCreado?: () => void;
  modalEditar?: React.ReactNode;
  onEditar?: (usuario: Usuario) => void;
}

export default function ListaUsuarios({ 
  titulo, 
  tipoUsuario, 
  icono: IconoTipo, 
  obtenerUsuarios,
  onCrear,
  modalCrear,
  onUsuarioCreado,
  modalEditar,
  onEditar
}: ListaUsuariosProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cambiandoEstado, setCambiandoEstado] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Llamar onUsuarioCreado cuando se necesite refrescar la lista
  useEffect(() => {
    if (onUsuarioCreado) {
      cargarUsuarios();
    }
  }, [onUsuarioCreado]);

  const filteredData = useMemo(() => {
    const filtered = usuarios.filter((usuario) => {
      const nombreCompleto = usuario.nombre_empresa || `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
      return nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
             usuario.numero_documento.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return filtered;
  }, [usuarios, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await obtenerUsuarios();
      if (response.success) {
        const usuariosOrdenados = response.data.usuarios.sort((a, b) => a.id_usuario - b.id_usuario);
        setUsuarios(usuariosOrdenados);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || `Error al cargar ${titulo.toLowerCase()}`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (usuario: Usuario) => {
    setCambiandoEstado(usuario.id_usuario);
    setError('');
    
    try {
      const response = await cambiarEstadoUsuario(usuario.id_usuario);
      if (response.success) {
        // Actualizar el usuario en la lista local
        setUsuarios(usuarios.map(u => 
          u.id_usuario === usuario.id_usuario 
            ? { ...u, activo: response.data.usuario.activo }
            : u
        ).sort((a, b) => a.id_usuario - b.id_usuario));
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al cambiar estado del usuario';
      setError(msg);
    } finally {
      setCambiandoEstado(null);
    }
  };

  const getRoleIcon = (tipoUsuario: string) => {
    switch (tipoUsuario) {
      case 'administradores': return Shield;
      case 'secretarios': return UserCog;
      case 'demandantes': return UserCheck;
      case 'demandados': return UserX;
      case 'arbitros': return User;
      default: return Shield;
    }
  };

  const getRoleColor = (tipoUsuario: string) => {
    switch (tipoUsuario) {
      case 'administradores': return 'bg-red-100 text-red-800';
      case 'secretarios': return 'bg-blue-100 text-blue-800';
      case 'demandantes': return 'bg-green-100 text-green-800';
      case 'demandados': return 'bg-orange-100 text-orange-800';
      case 'arbitros': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <IconoTipo className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestión de {titulo}</h1>
            <p className="text-slate-600">Administra los {titulo.toLowerCase()} del sistema</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-sm text-slate-600">Cargando {titulo.toLowerCase()}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-slate-50">
                <IconoTipo className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestión de {titulo}</h1>
                <p className="mt-1 text-slate-600">Administra los {titulo.toLowerCase()} del sistema</p>
              </div>
            </div>
            
            {onCrear && (
              <button
                onClick={onCrear}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-[#132436] rounded-lg shadow-sm hover:bg-[#224666]"
              >
                <Plus className="w-4 h-4" />
                <span>Crear {titulo}</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  placeholder="Buscar por nombre o documento..."
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

      {/* Error Message */}
      {error && (
        <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead className="border-b bg-slate-50 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-left">Usuario</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Número Documento</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Creado</th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider uppercase text-slate-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <IconoTipo className="w-12 h-12 mb-3" />
                      <p className="text-sm font-medium">No se encontraron {titulo.toLowerCase()}</p>
                      <p className="text-xs mt-1">
                        {searchTerm ? "Intenta con otro término de búsqueda" : `Agrega tu primer ${titulo.slice(0, -1).toLowerCase()}`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((usuario) => (
                  <tr key={usuario.id_usuario} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center">
                        <div>
                          <p className="font-medium text-slate-900">
                            {usuario.nombre_empresa || `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 text-center font-mono">
                      {usuario.numero_documento}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        usuario.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.activo ? (
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
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">
                      {new Date(usuario.created_at).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {onEditar && (
                          <button
                            onClick={() => onEditar(usuario)}
                            className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleCambiarEstado(usuario)}
                          disabled={cambiandoEstado === usuario.id_usuario}
                          className={`p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            usuario.activo 
                              ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                              : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          }`}
                          title={usuario.activo ? "Desactivar" : "Activar"}
                        >
                          {cambiandoEstado === usuario.id_usuario ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : usuario.activo ? (
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
                <span className="font-medium">{filteredData.length}</span> {titulo.toLowerCase()}
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

      {/* Modal Crear */}
      {modalCrear}

      {/* Modal Editar */}
      {modalEditar}
    </div>
  );
}