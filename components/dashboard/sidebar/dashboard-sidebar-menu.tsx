'use client';

import { ChevronLeft, PackageSearch, Settings2 } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

type DashboardRoutes = {
  id: number;
  label: string;
  icon: any;
  children?: {
    id: number;
    label: string;
    address: string;
  }[];
};

const items: DashboardRoutes[] = [
  {
    id: 1,
    label: 'محصولات',
    icon: PackageSearch,
    children: [
      {
        id: 1,
        label: 'مدیریت محصولات',
        address: '/control/products',
      },
      {
        id: 2,
        label: 'دسته‌بندی',
        address: '/control/products/categories',
      },
    ],
  },
  {
    id: 2,
    label: 'تنظیمات',
    icon: Settings2,
    children: [
      {
        id: 1,
        label: 'عمومی',
        address: '/control/settings',
      },
    ],
  },
];

export function DashboardSidebarMenu() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map(item => (
          <Collapsible key={item.id} asChild className='group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                {/* <SidebarMenuButton tooltip={item.title}> */}
                <SidebarMenuButton>
                  {item.icon && <item.icon />}
                  <span className='translate-y-px'>{item.label}</span>
                  <ChevronLeft className='mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className='border-r border-l-0'>
                  {item.children?.map(subItem => (
                    <SidebarMenuSubItem key={subItem.label}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.address}>
                          <span>{subItem.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
