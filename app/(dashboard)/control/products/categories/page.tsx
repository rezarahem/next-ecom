import DashContainerSidebar from '@/components/ui/dash-page-container';
import { getSeesion } from '@/lib/session';
import { redirect } from 'next/navigation';

const ProductCategories = async () => {
  const session = await getSeesion();
  if (!session) redirect('/login?callbackUrl=/control/products/categories');

  return (
    <DashContainerSidebar>
      <div>main</div>
      {/* <div className='border-r w-80'></div> */}
    </DashContainerSidebar>
  );
};

export default ProductCategories;
