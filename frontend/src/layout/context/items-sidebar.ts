import {
    Building,
    FileText,
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
        titulo: 'Expedientes',
        icon: FileText,
        link: '/administrator/expediente'
    },
    {
        titulo: 'Plantillas',
        icon: Building,
        link: '/administrator/plantilla'
    },
];
