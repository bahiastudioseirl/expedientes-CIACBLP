import { UserCog } from 'lucide-react';
import { useState } from 'react';
import ListaUsuarios from '../components/ListaUsuarios';
import ModalUsuarioPersona from '../components/ModalUsuarioPersona';
import { obtenerSecretarios, crearSecretario, actualizarUsuarioPersona } from '../services/usuariosService';
import type { CrearUsuarioPersonaRequest, ActualizarUsuarioPersonaRequest, Usuario } from '../schemas/UsuarioSchema';

export default function SecretariosPage() {
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [saving, setSaving] = useState(false);

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
      const response = await crearSecretario(data);
      
      if (response.success) {
        setIsCrearModalOpen(false);
      }
    } catch (err: any) {
      console.error('Error al crear secretario:', err);
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
    } catch (err: any) {
      console.error('Error al actualizar secretario:', err);
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
        titulo="Secretarios"
        tipoUsuario="secretarios"
        icono={UserCog}
        obtenerUsuarios={obtenerSecretarios}
        onCrear={handleCrear}
        onEditar={handleEditar}
        modalCrear={
          <ModalUsuarioPersona
            open={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            onSave={handleSave}
            loading={saving}
            tipoUsuario="secretario"
          />
        }
        modalEditar={
          selectedUsuario && (
            <ModalUsuarioPersona 
              open={isEditarModalOpen}
              usuario={selectedUsuario}
              onClose={handleCloseEditModal}
              onUpdate={handleUpdate}
              tipoUsuario="secretario"
            />
          )
        }
      />
    </div>
  );
}