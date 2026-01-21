import { UserCog } from 'lucide-react';
import { useState } from 'react';
import ListaUsuarios from '../components/ListaUsuarios';
import ModalUsuarioPersona from '../components/ModalUsuarioPersona';
import { obtenerContadores, actualizarUsuario, crearContador } from '../services/usuariosService';
import type { CrearUsuarioRequest, ActualizarUsuarioRequest, Usuario } from '../schemas/UsuarioSchema';

export default function ContadoresPage() {
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
      const response = await crearContador(data);
      
      if (response.success) {
        setIsCrearModalOpen(false);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err: any) {
      console.error('Error al crear contador:', err);
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
      console.error('Error al actualizar contador:', err);
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
        titulo="Contadores"
        tipoUsuario="contadores"
        icono={UserCog}
        obtenerUsuarios={obtenerContadores}
        onCrear={handleCrear}
        onEditar={handleEditar}
        modalCrear={
          <ModalUsuarioPersona
            open={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            onSave={handleSave}
            loading={saving}
            tipoUsuario="contador"
          />
        }
        modalEditar={
          selectedUsuario && (
            <ModalUsuarioPersona 
              open={isEditarModalOpen}
              usuario={selectedUsuario}
              onClose={handleCloseEditModal}
              onUpdate={handleUpdate}
              tipoUsuario="contador"
            />
          )
        }
      />
    </div>
  );
}