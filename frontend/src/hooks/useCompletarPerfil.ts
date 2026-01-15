import { useState } from 'react';
import { actualizarPerfil } from '../services/perfilService';
import type { User } from '../core/components/auth/schemas/LoginSchema';

interface UseCompletarPerfilProps {
  usuario: User | null;
  onPerfilActualizado: (usuario: User) => void;
}

export const useCompletarPerfil = ({ usuario, onPerfilActualizado }: UseCompletarPerfilProps) => {
  const [mostrarModal, setMostrarModal] = useState(() => {
    if (!usuario) return false;
    const rolesQueNecesitanPerfil = ['Demandado', 'Demandante'];
    if (!rolesQueNecesitanPerfil.includes(usuario.rol)) return false;
    return !usuario.nombre_completo || usuario.nombre_completo.trim().length === 0;
  });

  const guardarPerfil = async (nombreCompleto: string): Promise<boolean> => {
    try {
      const response = await actualizarPerfil({ nombre_completo: nombreCompleto });
      
      if (response.success && response.data?.usuario) {
        onPerfilActualizado(response.data.usuario);
        setMostrarModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      return false;
    }
  };

  const cerrarModal = () => {
    if (usuario?.nombre_completo || !['Demandado', 'Demandante'].includes(usuario?.rol || '')) {
      setMostrarModal(false);
    }
  };

  const puedeOmitir = usuario?.nombre_completo || !['Demandado', 'Demandante'].includes(usuario?.rol || '');

  return {
    mostrarModal,
    guardarPerfil,
    cerrarModal: puedeOmitir ? cerrarModal : undefined
  };
};