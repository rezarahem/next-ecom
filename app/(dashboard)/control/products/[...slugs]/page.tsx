import ProductFormClient from '@/components/dashboard/product/product/product-form-client';
import Container from '@/components/ui/container';
import { getAllCatsTree } from '@/drizzle/db-query/category';
import { userAccess } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control/products';

type Params = Promise<{ slugs: string[] }>;

const ProductPage = async ({ params }: { params: Params }) => {
  const { slugs } = await params;

  if (slugs.length > 2) notFound();

  const user = await userAccess(roles);

  if (!user) redirect(redirectUrl);

  const cats = await getAllCatsTree();

  return (
    <Container defualtPY>
      <ProductFormClient current={undefined} allCats={cats} />
    </Container>
  );
};

export default ProductPage;
