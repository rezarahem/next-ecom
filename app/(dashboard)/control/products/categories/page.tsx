import { redirect } from 'next/navigation';
import AddNewBtn from '@/components/ui/add-new-btn';
import { getAllCats } from '@/drizzle/db-query/category';
import CategoryChip from '@/components/dashboard/product/category/category-chip';
import Container from '@/components/ui/container';
import { userAccess } from '@/lib/session';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control/products/categories';

const ProductCategories = async () => {
  const user = await userAccess(roles);
  if (!user) redirect(redirectUrl);

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
