import { getSeesion } from '@/lib/session';
import { redirect } from 'next/navigation';
import AddNewCat from './add-new-cat';

const ProductCategories = async () => {
  const session = await getSeesion();
  if (!session) redirect('/login?callbackUrl=/control/products/categories');

  return (
    <div>
      
      <AddNewCat />
    </div>
  );
};

export default ProductCategories;
