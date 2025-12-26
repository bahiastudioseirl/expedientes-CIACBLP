import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { LogOut, User } from 'lucide-react';

export const AdminLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-[#132436] shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-xl font-semibold text-white">
                Panel de Administración
              </h1>
              <p className="text-sm text-white">
                Gestión de Eproject
              </p>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-white">
                <User className="w-4 h-4" />
                <span>Administrador</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};