import { useState } from 'react';
import { User } from 'lucide-react';
import ListaUsuarios from '../components/ListaUsuarios';
import ModalUsuarioPersona from '../components/ModalUsuarioPersona';
import ModalCrearArbitro from '../components/ModalCrearArbitro';
import { obtenerArbitros, crearArbitro, actualizarUsuario } from '../services/usuariosService';
import type { CrearUsuarioRequest, ActualizarUsuarioRequest, Usuario } from '../schemas/UsuarioSchema';

export default function ArbitrosPage() {
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isCrearAdvancedModalOpen, setIsCrearAdvancedModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCrear = () => {
    setIsCrearAdvancedModalOpen(true);
  };

  const handleEditar = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsEditarModalOpen(true);
  };

  const handleSave = async (data: CrearUsuarioRequest) => {
    setSaving(true);
    try {
      const response = await crearArbitro(data);
      
      if (response.success) {
        setIsCrearModalOpen(false);
        setRefreshTrigger(prev => prev + 1); // Forzar refresh
      }
    } catch (err: any) {
      console.error('Error al crear árbitro:', err);
      // El error se maneja en el modal
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessAdvanced = () => {
    setIsCrearAdvancedModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUpdate = async (data: ActualizarUsuarioRequest) => {
    if (!selectedUsuario) return;
    
    try {
      await actualizarUsuario(selectedUsuario.id_usuario, data);
      setIsEditarModalOpen(false);
      setSelectedUsuario(null);
      setRefreshTrigger(prev => prev + 1); 
    } catch (err: any) {
      console.error('Error al actualizar árbitro:', err);
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
        titulo="Árbitros"
        tipoUsuario="arbitros"
        icono={User}
        obtenerUsuarios={obtenerArbitros}
        onCrear={handleCrear}
        onEditar={handleEditar}
        modalCrear={
          <ModalUsuarioPersona 
            open={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            onSave={handleSave}
            loading={saving}
            tipoUsuario="arbitro"
          />
        }
        modalEditar={
          selectedUsuario && (
            <ModalUsuarioPersona 
              open={isEditarModalOpen}
              usuario={selectedUsuario}
              onClose={handleCloseEditModal}
              onUpdate={handleUpdate}
              tipoUsuario="arbitro"
            />
          )
        }
      />

      {/* Modal avanzado con búsqueda */}
      <ModalCrearArbitro
        open={isCrearAdvancedModalOpen}
        onClose={() => setIsCrearAdvancedModalOpen(false)}
        onSuccess={handleSuccessAdvanced}
      />
    </div>
  );
}