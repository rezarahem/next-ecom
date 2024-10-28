import CategoryFormClient from '@/components/dashboard/product/category/category-form';
import Container from '@/components/ui/container';
import { getCategoryByAddressName } from '@/drizzle/db-query/category';
import { getSeesion } from '@/lib/session';
import { redirect } from 'next/navigation';

type SearchParams = Promise<{
  addressName: string;
}>;

const CategoryForm = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const session = await getSeesion();
  if (!session) redirect('/login?callbackUrl=/control/products/categories');
  const { addressName } = await searchParams;

  const cat = await getCategoryByAddressName(addressName);

  return (
    <Container defualtPY>
      <CategoryFormClient currentCat={cat} />
    </Container>
  );
};

export default CategoryForm;
