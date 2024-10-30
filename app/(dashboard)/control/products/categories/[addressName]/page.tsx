import CategoryFormClient from '@/components/dashboard/product/category/category-form';
import Container from '@/components/ui/container';
import {
  getAllCats,
  getCategoryByAddressName,
  getCatsExcludeTree,
} from '@/drizzle/db-query/category';
import { adminAccess } from '@/lib/session';
import { redirect } from 'next/navigation';

type Params = Promise<{ addressName: string }>;

const CategoryForm = async ({ params }: { params: Params }) => {
  const session = await adminAccess();
  if (!session) redirect('/login?callbackUrl=/control/products/categories');

  const { addressName } = await params;

  const currentCat = await getCategoryByAddressName(addressName);

  const allcats =
    currentCat ? await getCatsExcludeTree(currentCat?.id) : await getAllCats();

  return (
    <Container defualtPY>
      <CategoryFormClient currentCat={currentCat} allCats={allcats} />
    </Container>
  );
};

export default CategoryForm;
