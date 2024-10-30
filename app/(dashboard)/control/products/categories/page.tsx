import { adminAccess, getSeesion } from '@/lib/session';
import { redirect } from 'next/navigation';
import AddNewBtn from '../../../../../components/ui/add-new-btn';
import { getAllCats } from '@/drizzle/db-query/category';
import CategoryChip from '@/components/dashboard/product/category/category-chip';
import Container from '@/components/ui/container';

const ProductCategories = async () => {
  const session = await adminAccess();
  if (!session) redirect('/login?callbackUrl=/control/products/categories');

  const allCats = await getAllCats();

  return (
    <Container defualtPY>
      <div className='flex flex-wrap gap-3'>
        {allCats.map((cat, i) => (
          <CategoryChip key={cat.id} cat={cat} />
        ))}
      </div>
      <AddNewBtn href='/control/products/categories/new' />
    </Container>
  );
};

export default ProductCategories;
