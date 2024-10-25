import { getSeesion } from '@/lib/session';
import { redirect } from 'next/navigation';


const ProductCategories = async () => {
  const session = await getSeesion();
  if (!session) redirect('/login?callbackUrl=/control/products/categories');

  

  return <div>product categories</div>;
};

export default ProductCategories;
