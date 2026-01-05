import { Shield } from 'lucide-react';
import { useState } from 'react';
import ListaUsuarios from '../components/ListaUsuarios';
import ModalUsuarioPersona from '../components/ModalUsuarioPersona';
import { obtenerAdministradores, crearAdministrador, actualizarUsuarioPersona } from '../services/usuariosService';
import type { CrearUsuarioPersonaRequest, ActualizarUsuarioPersonaRequest, Usuario } from '../schemas/UsuarioSchema';

export default function AdministradoresPage() {
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCrear = () => {
    setIsCrearModalOpen(true);
  };

  const handleEditar = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsEditarModalOpen(true);
  };

  const handleSave = async (data: CrearUsuarioPersonaRequest) => {
    setSaving(true);
    try {
      const response = await crearAdministrador(data);
      
      if (response.success) {
        setIsCrearModalOpen(false);
        setRefreshKey(prev => prev + 1); // Trigger refresh
      }
    } catch (err: any) {
      console.error('Error al crear administrador:', err);
      // El error se maneja en el modal
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: ActualizarUsuarioPersonaRequest) => {
    if (!selectedUsuario) return;
    
    try {
      await actualizarUsuarioPersona(selectedUsuario.id_usuario, data);
      setIsEditarModalOpen(false);
      setSelectedUsuario(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      console.error('Error al actualizar administrador:', err);
      throw err;
    }
  };

  const handleUsuarioCreado = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUsuarioEditado = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCloseEditModal = () => {
    setIsEditarModalOpen(false);
    setSelectedUsuario(null);
  };

  return (
    <div className="space-y-6">
      <ListaUsuarios
        titulo="Administradores"
        tipoUsuario="administradores"
        icono={Shield}
        obtenerUsuarios={obtenerAdministradores}
        onCrear={handleCrear}
        onEditar={handleEditar}
        modalCrear={
          <ModalUsuarioPersona
            open={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            onSave={handleSave}
            loading={saving}
            tipoUsuario="administrador"
          />
        }
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