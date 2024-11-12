import DashboardNavbar from '@/components/dashboard/navbar/dashboard-nvbar';
import DashboardSidebar from '@/components/dashboard/sidebar/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { userSession } from '@/lib/session';
import { cookies } from 'next/headers';

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  const session = await userSession();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <DashboardSidebar user={session} />
      <div className='grid min-h-dvh w-full grid-rows-[auto_1fr]'>
        <DashboardNavbar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
