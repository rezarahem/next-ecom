import React from 'react';

const DashContainerSidebar = ({ children }: { children: React.ReactNode }) => {
  return <div className='p-5 grid grid-cols-[1fr_auto]'>{children}</div>;
};
export default DashContainerSidebar ;
