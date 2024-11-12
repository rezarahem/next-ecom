import AddNewBtn from '@/components/ui/add-new-btn';
import Container from '@/components/ui/container';
import { userAccess } from '@/lib/session';
import { redirect } from 'next/navigation';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control/products';

const Products = async () => {
  const user = await userAccess(roles);
  if (!user) redirect(redirectUrl);

  return (
    <Container>
      <div>products</div>
      <AddNewBtn href='/control/products/new' />
    </Container>
  );
};

export default Products;
