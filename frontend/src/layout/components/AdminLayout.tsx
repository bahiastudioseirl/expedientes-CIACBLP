import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { LogOut, User, Menu } from 'lucide-react';
import { AuthStore } from '../../core/components/auth/services/AuthStore';
import { CompletarPerfilModal } from '../../components/modals/CompletarPerfilModal';
import { useCompletarPerfil } from '../../hooks/useCompletarPerfil';
import type { User as UserType } from '../../core/components/auth/schemas/LoginSchema';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(AuthStore.getUser());
  
  const { mostrarModal, guardarPerfil, cerrarModal } = useCompletarPerfil({
    usuario: currentUser,
    onPerfilActualizado: (usuarioActualizado) => {
      AuthStore.setUser(usuarioActualizado);
      setCurrentUser(usuarioActualizado);
    }
  });

  const handleLogout = () => {
    AuthStore.clearAll();
    window.location.href = '/';
  };

  // Determinar el título del panel según el rol
  const getPanelTitle = () => {
    switch (currentUser?.rol) {
      case 'Administrador':
        return 'Panel de Administración';
      case 'Secretario':
        return 'Portal Secretario';
      case 'Arbitro':
        return 'Portal de Árbitro';
      case 'Demandado':
        return 'Portal del Demandado';
      case 'Demandante':
        return 'Portal del Demandante';
      default:
        return 'Portal CIACBLP';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Header */}
        <header className="bg-[#132436] shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Botón hamburguesa - solo visible en mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-white">
                  {getPanelTitle()}
                </h1>
                <p className="text-xs sm:text-sm text-white hidden sm:block">
                  Gestión de Expedientes CIACBLP
                </p>
              </div>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-white">
                <User className="w-4 h-4" />
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-medium">{currentUser?.nombre_completo || 'Usuario'}</span>
                  <span className="text-xs opacity-75">{currentUser?.rol}</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Modal de completar perfil */}
      {currentUser && (
        <CompletarPerfilModal
          isOpen={mostrarModal}
          onClose={cerrarModal}
          currentUser={{
            id_usuario: currentUser.id,
            nombre_completo: currentUser.nombre_completo,
            correo: currentUser.correo,
            rol: currentUser.rol
          }}
          onSave={guardarPerfil}
        />
      )}
    </div>
  );
};