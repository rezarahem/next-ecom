'use client';

import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

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
import { DashboardSidebarMenuItemsTypes } from './dashboard-sidebar-menu-items';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type DashboardSidebarMenuProps = {
  menus: DashboardSidebarMenuItemsTypes[];
};

export function DashboardSidebarMenu({ menus }: DashboardSidebarMenuProps) {
  const [, , firstSeg, secondSeg] = usePathname().split('/');
  const { toggleSidebar, isMobile } = useSidebar();

  const handleCloseOnMobile = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {menus.map(item => (
          <Collapsible key={item.id} asChild className='group/collapsible'>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className={cn({
                    'text-blue-500': firstSeg === item.activeLabel,
                  })}>
                  {item.icon}
                  <span className='translate-y-px'>{item.label}</span>
                  <ChevronLeft className='mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className='border-r border-l-0'>
                  {item.children?.map(subItem => (
                    <SidebarMenuSubItem key={subItem.label}>
                      {subItem.address && (
                        <SidebarMenuSubButton
                          onClick={handleCloseOnMobile}
                          asChild
                          className={cn({
                            'text-blue-500':
                              secondSeg ?
                                secondSeg === subItem.activeLabel
                              : firstSeg === subItem.activeLabel,
                          })}>
                          <Link href={subItem.address}>
                            <span>{subItem.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      )}
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
