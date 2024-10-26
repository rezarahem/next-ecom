import 'server-only';
import { JSX } from 'react';
import { PackageSearch, Settings2 } from 'lucide-react';

type Access = 'user' | 'admin';

export type DashboardSidebarMenuItemsTypes = {
  id: number;
  label: string;
  access: Access[];
  activeLabel: string;
  address?: string;
  icon?: JSX.Element;
  children?: DashboardSidebarMenuItemsTypes[];
};

const MenuItems: DashboardSidebarMenuItemsTypes[] = [
  {
    id: 1,
    label: 'محصولات',
    icon: <PackageSearch />,
    access: ['admin'],
    activeLabel: 'products',
    children: [
      {
        id: 1,
        label: 'مدیریت محصولات',
        address: '/control/products',
        access: ['admin'],
        activeLabel: 'products',
      },
      {
        id: 2,
        label: 'دسته‌بندی',
        address: '/control/products/categories',
        access: ['admin'],
        activeLabel: 'categories',
      },
    ],
  },
  {
    id: 2,
    label: 'تنظیمات',
    icon: <Settings2 />,
    access: ['admin'],
    activeLabel: 'settings',
    children: [
      {
        id: 1,
        label: 'عمومی',
        address: '/control/settings',
        access: ['admin'],
        activeLabel: 'settings',
      },
    ],
  },
];

const dashboardMenus = (
  menuItems: DashboardSidebarMenuItemsTypes[],
  userAccess: string | undefined
): DashboardSidebarMenuItemsTypes[] => {
  return menuItems
    .filter(item => item.access.includes(userAccess as Access))
    .map(item => ({
      ...item,
      children:
        item.children ? dashboardMenus(item.children, userAccess) : undefined,
    }))
    .filter(item => item.children?.length || !item.children);
};

export const getMenu = (userAccess: string | undefined) => {
  return dashboardMenus(MenuItems, userAccess);
};
