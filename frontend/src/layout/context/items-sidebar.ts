import {
    Building,
    FileText,
    Inbox,
    Users,
    Shield,
    UserCog,
    UserCheck,
    UserX,
    User,
    ClipboardList,
    type LucideIcon
} from 'lucide-react';
import { AuthStore } from '../../core/components/auth/services/AuthStore';

export interface MenuItem {
    titulo: string;
    icon: LucideIcon;
    link?: string;
    subMenu?: SubMenuItem[];
    roles?: string[];
}

export interface SubMenuItem {
    titulo: string;
    link: string;
    icon: LucideIcon;
    roles?: string[];
}

const getMenuItems = (): MenuItem[] => {
    const user = AuthStore.getUser();
    console.log('getMenuItems - user:', user); // Debug log
    if (!user) return [];

    const userRole = user.rol;
    const isAdmin = userRole === 'Administrador';
    
    console.log('getMenuItems - userRole:', userRole); // Debug log

    // Menú específico según el rol del usuario
    switch (userRole) {
        case 'Administrador':
            return [
                {
                    titulo: 'Bandeja de Entrada',
                    icon: Inbox,
                    link: '/bandeja-entrada',
                    roles: ['Administrador']
                },
                {
                    titulo: 'Expedientes',
                    icon: FileText,
                    link: '/administrator/expediente',
                    roles: ['Administrador']
                },
                {
                    titulo: 'Solicitudes',
                    icon: ClipboardList,
                    link: '/administrator/solicitud',
                    roles: ['Administrador']
                },
                {
                    titulo: 'Plantillas',
                    icon: Building,
                    link: '/administrator/plantilla',
                    roles: ['Administrador']
                },
               /*} {
                    titulo: 'Usuarios',
                    icon: Users,
                    roles: ['Administrador'],
                    subMenu: [
                        {
                            titulo: 'Administradores',
                            link: '/administrator/usuarios/administradores',
                            icon: Shield,
                            roles: ['Administrador']
                        },
                        {
                            titulo: 'Secretarios',
                            link: '/administrator/usuarios/secretarios',
                            icon: UserCog,
                            roles: ['Administrador']
                        },
                        {
                            titulo: 'Demandantes',
                            link: '/administrator/usuarios/demandantes',
                            icon: UserCheck,
                            roles: ['Administrador']
                        },
                        {
                            titulo: 'Demandados',
                            link: '/administrator/usuarios/demandados',
                            icon: UserX,
                            roles: ['Administrador']
                        },
                        {
                            titulo: 'Árbitros',
                            link: '/administrator/usuarios/arbitros',
                            icon: User,
                            roles: ['Administrador']
                        }
                    ]
                },
                */
            ];

        case 'Secretario':
        case 'Arbitro':
            return [
                {
                    titulo: 'Bandeja de Entrada',
                    icon: Inbox,
                    link: '/bandeja-entrada',
                    roles: ['Secretario', 'Arbitro']
                },
                {
                    titulo: 'Expedientes',
                    icon: FileText,
                    link: '/expedientes',
                    roles: ['Secretario', 'Arbitro']
                }
            ];

        case 'Demandado':
        case 'Demandante':
            return [
                {
                    titulo: 'Bandeja de Entrada',
                    icon: Inbox,
                    link: '/bandeja-entrada',
                    roles: ['Demandado', 'Demandante']
                }
            ];

        default:
            return [];
    }
};

export { getMenuItems };
export const menuItems = getMenuItems();
