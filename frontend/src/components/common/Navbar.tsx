import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosWithoutMultipart } from '../../api/axiosInstance';
import logoCiacblp from '../../assets/logo-ciacblp.webp';

interface UserInfo {
    id: number;
    numero_documento: string;
    nombre_completo: string;
    correo: string;
}

interface NavbarProps {
    className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/registro-solicitante');
                return;
            }

            const response = await axiosWithoutMultipart.get('solicitudes/me');
            setUser(response.data.usuario);
        } catch (error) {
            console.error('Error fetching user info:', error);
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                await axiosWithoutMultipart.post('solicitudes/logout');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('authToken');
            navigate('/registro-solicitante');
        }
    };

    const getDisplayName = () => {
        if (!user) return '';
        return user.nombre_completo || 'Usuario';
    };

    if (loading) {
        return (
            <nav className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                        <div className="flex items-center">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo y título */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <img 
                                src={logoCiacblp} 
                                alt="CIACBLP Logo" 
                                className="w-45 h-45 object-contain"
                            />

                        </div>
                    </div>

                    {/* Información del usuario y botón salir */}
                    <div className="flex items-center space-x-4">
                        {/* Información del usuario - Desktop */}
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {getDisplayName()}
                                </p>
                                <p className="text-xs text-gray-500">{user?.correo}</p>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-sm">
                                    {user?.nombre_completo?.charAt(0) || 'U'}
                                </span>
                            </div>
                        </div>

                        {/* Botón de menú móvil */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                        </div>

                        {/* Botón salir - Desktop */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 hover:border-red-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Salir
                        </button>
                    </div>
                </div>

                {/* Menú móvil */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-3 space-y-3">
                            {/* Información del usuario - Móvil */}
                            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-medium">
                                        {user?.nombre_completo?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {getDisplayName()}
                                    </p>
                                    <p className="text-xs text-gray-500">{user?.correo}</p>
                                </div>
                            </div>
                            
                            {/* Botón salir - Móvil */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};