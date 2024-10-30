import NavbarClient from './navbar-client';

const DashboardNavbar = () => {
  return (
    <div className='sticky top-0 z-20 h-12 border-b sm:h-14 bg-sidebar'>
      <NavbarClient />
    </div>
  );
};

export default DashboardNavbar;
