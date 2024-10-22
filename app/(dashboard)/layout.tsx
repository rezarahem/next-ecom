import DashboardNavbar from '@/components/dashboard/navbar/dashboard-nvbar';
import DashboardSidebar from '@/components/dashboard/sidebar/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className='w-full grid min-h-dvh grid-rows-[auto_1fr]'>
        <DashboardNavbar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
