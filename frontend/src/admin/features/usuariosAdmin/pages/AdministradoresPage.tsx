import { Shield } from 'lucide-react';
import { useState } from 'react';
import ListaUsuarios from '../components/ListaUsuarios';
import ModalUsuarioPersona from '../components/ModalUsuarioPersona';
import { obtenerAdministradores, crearAdministrador, actualizarUsuario } from '../services/usuariosService';
import type { CrearUsuarioRequest, ActualizarUsuarioRequest, Usuario } from '../schemas/UsuarioSchema';

export default function AdministradoresPage() {
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCrear = () => {
    setIsCrearModalOpen(true);
  };

  const handleEditar = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsEditarModalOpen(true);
  };

  const handleSave = async (data: CrearUsuarioRequest) => {
    setSaving(true);
    try {
      const response = await crearAdministrador(data);
      
      if (response.success) {
        setIsCrearModalOpen(false);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      console.error('Error al crear administrador:', err);
      // El error se maneja en el modal
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: ActualizarUsuarioRequest) => {
    if (!selectedUsuario) return;
    
    try {
      await actualizarUsuario(selectedUsuario.id_usuario, data);
      setIsEditarModalOpen(false);
      setSelectedUsuario(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      console.error('Error al actualizar administrador:', err);
      throw err;
    }
  };
  const handleCloseEditModal = () => {
    setIsEditarModalOpen(false);
    setSelectedUsuario(null);
  };

  return (
    <div className="space-y-6">
      <ListaUsuarios
        key={refreshTrigger}
        titulo="Administradores"
        tipoUsuario="administradores"
        icono={Shield}
        obtenerUsuarios={obtenerAdministradores}
        onEditar={handleEditar}
        modalEditar={
          selectedUsuario && (
            <ModalUsuarioPersona 
              open={isEditarModalOpen}
              usuario={selectedUsuario}
              onClose={handleCloseEditModal}
              onUpdate={handleUpdate}
              tipoUsuario="administrador"
            />
          )
        }
      />
    </div>
  );
}