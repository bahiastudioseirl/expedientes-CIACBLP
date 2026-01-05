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
        titulo: 'Bandeja de Entrada',
        icon: Inbox,
        link: '/administrator/bandeja-entrada'
    },
    {
        titulo: 'Expedientes',
        icon: FileText,
        link: '/administrator/expediente'
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
