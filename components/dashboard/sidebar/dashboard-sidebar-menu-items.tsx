import 'server-only';
import { JSX } from 'react';
import { PackageSearch, Settings2 } from 'lucide-react';

export type DashboardSidebarMenuItemsTypes = {
  id: number;
  label: string;
  access: string[];
  address?: string;
  icon?: JSX.Element;
  children?: DashboardSidebarMenuItemsTypes[];
};

export const MenuItems: DashboardSidebarMenuItemsTypes[] = [
  {
    id: 1,
    label: 'محصولات',
    icon: <PackageSearch />,
    access: ['admin'],
    children: [
      {
        id: 1,
        label: 'مدیریت محصولات',
        address: '/control/products',
        access: ['admin'],
      },
      {
        id: 2,
        label: 'دسته‌بندی',
        address: '/control/products/categories',
        access: ['admin'],
      },
    ],
  },
  {
    id: 2,
    label: 'تنظیمات',
    icon: <Settings2 />,
    access: ['admin'],
    children: [
      {
        id: 1,
        label: 'عمومی',
        address: '/control/settings',
        access: ['admin'],
      },
    ],
  },
];

const dashboardMenus = (
  menuItems: DashboardSidebarMenuItemsTypes[],
  userAccess: string
): DashboardSidebarMenuItemsTypes[] => {
  return menuItems
    .filter(item => item.access.includes(userAccess))
    .map(item => ({
      ...item,
      children:
        item.children ? dashboardMenus(item.children, userAccess) : undefined,
    }))
    .filter(item => item.children?.length || !item.children);
};

export const getMenu = (userAccess: string) => {
  return dashboardMenus(MenuItems, userAccess);
};
