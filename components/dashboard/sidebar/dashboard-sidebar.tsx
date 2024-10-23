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

type DashboardSidebarProps = {
  user: SessionTypes;
};

const DashboardSidebar = ({ user }: DashboardSidebarProps) => {
  return (
    <Sidebar side='right' collapsible='icon'>
      <SidebarContent>
        <ScrollArea dir='rtl' className='pl-1'>
          <DashboardSidebarMenu />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <DashboardSidebarFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
