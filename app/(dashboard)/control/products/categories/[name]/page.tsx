import CategoryFormClient from '@/components/dashboard/product/category/category-form-client';
import Container from '@/components/ui/container';
import { redirect } from 'next/navigation';
import { userAccess } from '@/lib/session';
import { removeDash } from '@/lib/persian-string';
import { getAllCats, getCategoryByName, getCatsExcludeTree } from '@/query';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control/products/categories';

type Params = Promise<{ name: string }>;

const CategoryForm = async ({ params }: { params: Params }) => {
  const user = await userAccess(roles);
  if (!user) redirect(redirectUrl);

  const { name } = await params;

  const currentCat = await getCategoryByName(
    removeDash(decodeURIComponent(name)),
  );

  const allCats = currentCat
    ? await getCatsExcludeTree(currentCat?.id)
    : await getAllCats();

  return (
    <Container defaultPY>
      <CategoryFormClient currentCat={currentCat} allCats={allCats} />
    </Container>
  );
};

export default CategoryForm;
