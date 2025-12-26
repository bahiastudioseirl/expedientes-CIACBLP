import {
    Settings,
    Image,
    UserCheck,
    Book,
    Building,
    ClipboardCheck,
    Hand,
    Users,
    BookOpen,
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
        titulo: 'Empresa',
        icon: Building,
        link: '/administrator/empresa'
    },
];
