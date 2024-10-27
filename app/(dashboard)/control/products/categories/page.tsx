import { getSeesion } from '@/lib/session';
import { redirect } from 'next/navigation';
import AddNewBtn from '../../../../../components/ui/add-new-btn';

const ProductCategories = async () => {
  const session = await getSeesion();
  
  if (!session) redirect('/login?callbackUrl=/control/products/categories');

  return (
    <div>
      <AddNewBtn href='/control/products/categories/new' />
    </div>
  );
};

export default ProductCategories;
