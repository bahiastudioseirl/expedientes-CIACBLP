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

export interface MenuItem {
    titulo: string;
    icon: LucideIcon;
    link?: string;
    subMenu?: SubMenuItem[];
}

export interface SubMenuItem {
    titulo: string;
    link: string;
    icon: LucideIcon;
}

export const menuItems: MenuItem[] = [
    {
        titulo: 'Solicitudes',
        icon: ClipboardList,
        link: '/administrator/solicitud'
    },
    {
        titulo: 'Expedientes',
        icon: FileText,
        link: '/administrator/expediente'
    },
    {
        titulo: 'Bandeja de Entrada',
        icon: Inbox,
        link: '/bandeja-entrada'
    },
    {
        titulo: 'Plantillas',
        icon: Building,
        link: '/administrator/plantilla'
    },

    {
        titulo: 'Usuarios',
        icon: Users,
        subMenu: [
            {
                titulo: 'Administradores',
                link: '/administrator/usuarios/administradores',
                icon: Shield
            },
            {
                titulo: 'Secretarios',
                link: '/administrator/usuarios/secretarios',
                icon: UserCog
            },
            {
                titulo: 'Demandantes',
                link: '/administrator/usuarios/demandantes',
                icon: UserCheck
            },
            {
                titulo: 'Demandados',
                link: '/administrator/usuarios/demandados',
                icon: UserX
            },
            {
                titulo: 'Árbitros',
                link: '/administrator/usuarios/arbitros',
                icon: User
            }
        ]
    },
];
