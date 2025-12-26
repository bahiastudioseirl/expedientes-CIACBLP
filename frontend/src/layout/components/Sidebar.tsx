import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { menuItems, type MenuItem, type SubMenuItem } from '../context/items-sidebar';

export const Sidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (titulo: string) => {
    setExpandedItems(prev =>
      prev.includes(titulo)
        ? prev.filter(item => item !== titulo)
        : [...prev, titulo]
    );
  };

  const isItemActive = (item: MenuItem | SubMenuItem): boolean => {
    if ('link' in item && item.link) {
      return location.pathname === item.link;
    }
    if ('subMenu' in item && item.subMenu) {
      return item.subMenu.some(subItem => location.pathname === subItem.link);
    }
    return false;
  };

  const isExpanded = (titulo: string): boolean => {
    return expandedItems.includes(titulo);
  };

  return (
    <div className="w-64 bg-white shadow-lg h-full border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="mx-auto h-10 w-40 rounded-full flex items-center justify-center">
             <img src="https://www.eprojectperu.com/wp-content/uploads/2025/08/logo-fondo-blanco.png" alt="Logo Eproject" />
            </div>
        <p className="text-sm text-gray-600 text-center">Panel Administrativo</p>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.titulo}>
              {/* Item Principal */}
              {item.link ? (
                // Item sin submenú - enlace directo
                <Link
                  to={item.link}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isItemActive(item)
                      ? 'bg-[#224666]/20 text-[#132436] border-l-4 border-red-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.titulo}
                </Link>
              ) : (
                // Item con submenú - botón expandible
                <button
                  onClick={() => toggleExpand(item.titulo)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isItemActive(item)
                      ? 'bg-[#224666]/20 text-[#132436]'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.titulo}
                  </div>
                  {isExpanded(item.titulo) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Submenú */}
              {item.subMenu && isExpanded(item.titulo) && (
                <ul className="mt-2 ml-6 space-y-1">
                  {item.subMenu.map((subItem) => (
                    <li key={subItem.titulo}>
                      <Link
                        to={subItem.link}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          isItemActive(subItem)
                            ? 'bg-[#224666]/20 text-[#132436] border-l-2 border-[#CD321A]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        <subItem.icon className="w-4 h-4 mr-3" />
                        {subItem.titulo}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};