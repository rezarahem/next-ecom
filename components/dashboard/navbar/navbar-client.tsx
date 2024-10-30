'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { useEffect } from 'react';
const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const NavbarClient = () => {
  const { open } = useSidebar();

  useEffect(() => {
    setSidebarState(open);
  }, [open]);

  const setSidebarState = (state: boolean) => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${state}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };

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
