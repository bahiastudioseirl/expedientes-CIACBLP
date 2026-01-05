import { Building } from 'lucide-react';
import { useState } from 'react';
import ListaUsuarios from '../components/ListaUsuarios';
import ModalUsuarioEmpresa from '../components/ModalUsuarioEmpresa';
import { obtenerDemandados, crearDemandado, actualizarUsuarioEmpresa } from '../services/usuariosService';
import type { CrearUsuarioEmpresaRequest, ActualizarUsuarioEmpresaRequest, Usuario } from '../schemas/UsuarioSchema';

export default function DemandadosPage() {
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
      const response = await crearDemandado(data);
      
      if (response.success) {
        setIsCrearModalOpen(false);
        setRefreshKey(prev => prev + 1);
      }
    } catch (err: any) {
      console.error('Error al crear demandado:', err);
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
      console.error('Error al actualizar demandado:', err);
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
        titulo="Demandados"
        tipoUsuario="demandados"
        icono={Building}
        obtenerUsuarios={obtenerDemandados}
        onCrear={handleCrear}
        onEditar={handleEditar}
        modalCrear={
          <ModalUsuarioEmpresa
            open={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            onSave={handleSave}
            loading={saving}
            tipoUsuario="demandado"
          />
        }
        modalEditar={
          selectedUsuario && (
            <ModalUsuarioEmpresa 
              open={isEditarModalOpen}
              usuario={selectedUsuario}
              onClose={handleCloseEditModal}
              onUpdate={handleUpdate}
              tipoUsuario="demandado"
            />
          )
        }
      />
    </div>
  );
}