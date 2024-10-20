import ThemeController from '@/components/ui/theme-controller';

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <div className='grid min-h-dvh grid-rows-[auto_1fr_auto]'>
        <div className='h-14 bg-blue-500'>test</div>
        <main>{children}</main>
        {/* <div className='bg-black'>test</div> */}
        <div className='h-44 border-t'>
          <ThemeController />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
