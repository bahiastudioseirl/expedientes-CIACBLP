import { useEffect, useState } from 'react';
import { AuthStore } from '../../core/components/auth/services/AuthStore';
import BandejaEntradaMain from './BandejaEntradaMain';
import type { User } from '../../core/components/auth/schemas/LoginSchema';

interface BandejaUser {
  id_usuario: number;
  id_rol: number;
  nombre: string;
  apellido?: string;
}

const mapUserToBandejaUser = (user: User): BandejaUser => {
  const roleMap: Record<string, number> = {
    'Administrador': 1,
    'Arbitro': 2, 
    'Secretario': 3,
    'Demandante': 4,
    'Demandado': 5
  };

  // Extraer nombre y apellido de nombre_completo
  const nombreCompleto = user.nombre_completo || '';
  const partes = nombreCompleto.trim().split(' ');
  const nombre = partes[0] || '';
  const apellido = partes.slice(1).join(' ') || undefined;

  return {
    id_usuario: user.id,
    id_rol: roleMap[user.rol] || 4, // Por defecto participante
    nombre: nombre,
    apellido: apellido
  };
};

export default function BandejaEntradaPage() {
  const [currentUser, setCurrentUser] = useState<BandejaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = AuthStore.getUser();
    
    if (user) {
      setCurrentUser(mapUserToBandejaUser(user));
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <BandejaEntradaMain currentUser={currentUser || undefined} />;
}