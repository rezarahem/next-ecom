import 'server-only';
import { PackageSearch, Settings2 } from 'lucide-react';

type AccessTypes = 'admin' | 'seller';

export type DashboardSidebarMenuItemsTypes = {
  id: number;
  label: string;
  access: AccessTypes[];
  address?: string;
  icon?: any;
  children?: DashboardSidebarMenuItemsTypes[];
};

export const items: DashboardSidebarMenuItemsTypes[] = [
  {
    id: 1,
    label: 'محصولات',
    icon: PackageSearch,
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
    icon: Settings2,
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
