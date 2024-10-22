'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

const NavbarClient = () => {
  return (
    <div className='flex h-full justify-between items-center px-3'>
      <div>
        <SidebarTrigger />
      </div>
      <div>
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default NavbarClient;
