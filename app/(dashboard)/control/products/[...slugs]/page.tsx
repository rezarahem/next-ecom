import ProductFormClient from '@/components/dashboard/product/product/product-form-client';
import Container from '@/components/ui/container';
import { userAceess } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control/products';

type Params = Promise<{ slugs: string[] }>;

const ProductPage = async ({ params }: { params: Params }) => {
  const { slugs } = await params;

  if (slugs.length > 2) notFound();

  const user = await userAceess(roles);
  
  if (!user) redirect(redirectUrl);

  return (
    <Container defualtPY>
      <ProductFormClient />
    </Container>
  );
};

export default ProductPage;
