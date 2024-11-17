import ProductChip from '@/components/dashboard/product/product/product-chip';
import AddNewBtn from '@/components/ui/add-new-btn';
import Container from '@/components/ui/container';
import { userAccess } from '@/lib/session';
import { getAllProducts } from '@/query';
import { redirect } from 'next/navigation';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control/products';

const Products = async () => {
  const user = await userAccess(roles);
  if (!user) redirect(redirectUrl);

  const products = await getAllProducts();

  return (
    <Container defaultPY>
      <div className='flex flex-wrap gap-3'>
        {products.map((pro, i) => (
          <ProductChip key={pro.id} pro={pro} />
        ))}
      </div>
      <AddNewBtn href='/control/products/new' />
    </Container>
  );
};

export default Products;
