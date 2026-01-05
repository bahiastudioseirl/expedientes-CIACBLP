import { Building2 } from 'lucide-react';
import { useState } from 'react';
import ListaUsuarios from '../components/ListaUsuarios';
import ModalUsuarioEmpresa from '../components/ModalUsuarioEmpresa';
import { obtenerDemandantes, crearDemandante, actualizarUsuarioEmpresa } from '../services/usuariosService';
import type { CrearUsuarioEmpresaRequest, ActualizarUsuarioEmpresaRequest, Usuario } from '../schemas/UsuarioSchema';

export default function DemandantesPage() {
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

  const handleSave = async (data: CrearUsuarioEmpresaRequest) => {
    setSaving(true);
    try {
      const response = await crearDemandante(data);
      
      if (response.success) {
        setIsCrearModalOpen(false);
        setRefreshKey(prev => prev + 1);
      }
    } catch (err: any) {
      console.error('Error al crear demandante:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: ActualizarUsuarioEmpresaRequest) => {
    if (!selectedUsuario) return;
    
    try {
      await actualizarUsuarioEmpresa(selectedUsuario.id_usuario, data);
      setIsEditarModalOpen(false);
      setSelectedUsuario(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      console.error('Error al actualizar demandante:', err);
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
        titulo="Demandantes"
        tipoUsuario="demandantes"
        icono={Building2}
        obtenerUsuarios={obtenerDemandantes}
        onCrear={handleCrear}
        onEditar={handleEditar}
        modalCrear={
          <ModalUsuarioEmpresa
            open={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            onSave={handleSave}
            loading={saving}
            tipoUsuario="demandante"
          />
        }
        modalEditar={
          selectedUsuario && (
            <ModalUsuarioEmpresa 
              open={isEditarModalOpen}
              usuario={selectedUsuario}
              onClose={handleCloseEditModal}
              onUpdate={handleUpdate}
              tipoUsuario="demandante"
            />
          )
        }
      />
    </div>
  );
}