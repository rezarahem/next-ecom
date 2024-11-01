import Container from '@/components/ui/container';
import { userAceess } from '@/lib/session';
import { redirect } from 'next/navigation';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control/products';

const Products = async () => {
  const user = await userAceess(roles);
  if (!user) redirect(redirectUrl);

  return <Container>products</Container>;
};

export default Products;
