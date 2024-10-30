import DashboardNavbar from '@/components/dashboard/navbar/dashboard-nvbar';
import DashboardSidebar from '@/components/dashboard/sidebar/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getSeesion } from '@/lib/session';
import { cookies } from 'next/headers';

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  const user = await getSeesion();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar user={user} />
      <div className='w-full grid min-h-dvh grid-rows-[auto_1fr]'>
        <DashboardNavbar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
