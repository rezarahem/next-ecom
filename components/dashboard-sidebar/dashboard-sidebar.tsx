import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { DashboardSidebarFooter } from './dashboard-sidebar-footer';
import { DashboardSidebarMenu } from './dashboard-sidebar-menu';
import { ScrollArea } from '../ui/scroll-area';

const DashboardSidebar = () => {
  return (
    <Sidebar side='right' collapsible='icon'>
      <SidebarContent>
        <ScrollArea dir='rtl'>
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
