import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BandejaEntrada from './components/BandejaEntrada';
import ListaAsuntos from './components/ListaAsuntos';
import type {
    ExpedienteAsignado,
    Asunto
} from './schemas/BandejaEntradaSchema';

type ViewMode = 'inbox' | 'asuntos';

interface BandejaEntradaMainProps {
    currentUser?: {
        id_usuario: number;
        id_rol: number;
        nombre: string;
        apellido?: string;
    };
}

export default function BandejaEntradaMain({ currentUser }: BandejaEntradaMainProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [viewMode, setViewMode] = useState<ViewMode>('inbox');
    const [selectedExpediente, setSelectedExpediente] = useState<ExpedienteAsignado | null>(null);

    // Manejar navegación de vuelta del chat
    useEffect(() => {
        if (location.state?.selectedExpediente) {
            setSelectedExpediente(location.state.selectedExpediente);
            setViewMode('asuntos');
            // Limpiar el state después de usarlo
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, location.pathname]);

    // Mock user si no se proporciona (para desarrollo)
    const user = currentUser || {
        id_usuario: 1,
        id_rol: 2, // Arbitro
        nombre: 'Usuario',
        apellido: 'Demo'
    };

    const handleSelectExpediente = (expediente: ExpedienteAsignado) => {
        setSelectedExpediente(expediente);
        setViewMode('asuntos');
    };

    const handleSelectAsunto = (asunto: Asunto) => {
        // Navegar a la página de chat con los datos necesarios
        navigate(`/bandeja-entrada/chat/asunto/${asunto.id_asunto}`, {
            state: {
                asunto,
                expediente: selectedExpediente,
                currentUser: user,
                userRole: user.id_rol
            }
        });
    };

    const handleBackToInbox = () => {
        setSelectedExpediente(null);
        setViewMode('inbox');
    };

    return (
        <div className="min-h-screen bg-slate-50">
           
            {/* Content */}
            <div className="max-w-full mx-auto px-2 sm:px-6 py-2">
                {viewMode === 'inbox' && (
                    <BandejaEntrada
                        onSelectExpediente={handleSelectExpediente}
                    />
                )}

                {viewMode === 'asuntos' && selectedExpediente && (
                    <ListaAsuntos
                        expediente={selectedExpediente}
                        onSelectAsunto={handleSelectAsunto}
                        onBack={handleBackToInbox}
                        userRole={user.id_rol}
                    />
                )}
            </div>
        </div>
    );
}