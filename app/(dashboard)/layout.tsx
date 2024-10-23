import DashboardNavbar from '@/components/dashboard/navbar/dashboard-nvbar';
import DashboardSidebar from '@/components/dashboard/sidebar/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getSeesion } from '@/lib/session';

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getSeesion(false);

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <div className='w-full grid min-h-dvh grid-rows-[auto_1fr]'>
        <DashboardNavbar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
