import CategoryFormClient from '@/components/dashboard/product/category/category-form-client';
import Container from '@/components/ui/container';
import {
  getAllCats,
  getCategoryByAddressName,
  getCatsExcludeTree,
} from '@/drizzle/db-query/category';
import { redirect } from 'next/navigation';
import { userAceess } from '@/lib/session';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control/products/categories';

type Params = Promise<{ addressName: string }>;

const CategoryForm = async ({ params }: { params: Params }) => {
  const user = await userAceess(roles);
  if (!user) redirect(redirectUrl);

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
