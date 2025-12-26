import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { menuItems, type MenuItem, type SubMenuItem } from '../context/items-sidebar';
import logoCiacblp from '../../assets/logo-ciacblp.webp';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
    <>
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:block
        w-64
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="mx-auto h-10 w-48 flex items-center justify-center relative">
            <img src={logoCiacblp} alt="Logo CIACBLP" className="max-h-full max-w-full object-contain" />
            
            {/* Botón cerrar solo visible en mobile */}
            <button
              onClick={onClose}
              className="absolute -right-2 top-1/2 transform -translate-y-1/2 lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
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
                  onClick={onClose}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isItemActive(item)
                      ? 'bg-[#224666]/20 text-[#132436] border-l-4 border-[#733AEA]'
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
                        onClick={onClose}
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

      {/* Overlay para mobile - DESPUÉS del sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};