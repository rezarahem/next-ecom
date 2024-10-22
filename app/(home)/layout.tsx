import ThemeController from '@/components/ui/theme-controller';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div className='grid min-h-dvh grid-rows-[auto_1fr_auto]'>
        <div className='h-14 border-b'></div>
        <main>{children}</main>
        <div className='h-44 border-t'>
          <ThemeSwitcher />
          {/* <ThemeController /> */}
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
