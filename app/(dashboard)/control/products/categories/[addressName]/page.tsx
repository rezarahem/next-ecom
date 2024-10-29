import CategoryFormClient from '@/components/dashboard/product/category/category-form';
import Container from '@/components/ui/container';
import {
  getCategoryByAddressName,
  getCatsExcludeTree,
} from '@/drizzle/db-query/category';
import { checkAdminAccess, getSeesion } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

type Params = Promise<{ addressName: string }>;

const CategoryForm = async ({ params }: { params: Params }) => {
  const session = await checkAdminAccess();
  if (!session) redirect('/login?callbackUrl=/control/products/categories');
  const { addressName } = await params;
  const cat = await getCategoryByAddressName(addressName);
  const catTree = cat ? await getCatsExcludeTree(cat?.id) : undefined;
  console.log(catTree);

  return (
    <Container defualtPY>
      <CategoryFormClient currentCat={cat} />
    </Container>
  );
};

export default CategoryForm;
