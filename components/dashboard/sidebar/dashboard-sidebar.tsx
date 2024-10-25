import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { DashboardSidebarFooter } from './dashboard-sidebar-footer';
import { DashboardSidebarMenu } from './dashboard-sidebar-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SessionTypes } from '@/lib/session';
import { getMenu } from './dashboard-sidebar-menu-items';

type DashboardSidebarProps = {
  user: SessionTypes;
};

const DashboardSidebar = ({ user }: DashboardSidebarProps) => {
  const menus = getMenu(user?.role);

  return (
    <Sidebar side='right' collapsible='icon'>
      <SidebarContent>
        <ScrollArea dir='rtl' className='pl-1'>
          <DashboardSidebarMenu menus={menus} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <DashboardSidebarFooter
          name={user?.name}
          phone={user?.phone}
          image={user?.image}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
