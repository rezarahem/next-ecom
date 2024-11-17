import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import { getProductById } from '@/query';
import Image from 'next/image';
import { notFound } from 'next/navigation';

type Params = Promise<{ slugs: string[] }>;

const Product = async ({ params }: { params: Params }) => {
  const { slugs } = await params;

  if (slugs.length > 2) notFound();

  const product = await getProductById(+slugs[0]);

  if (!product) notFound();

  return (
    <Container defaultPY>
      <div className='flex items-end justify-between'>
        <div className='flex items-end gap-2'>
          <Image
            src={product.thumb as string}
            alt={product.name}
            width={300}
            height={300}
            className='rounded-md'
          />
          <h1 className='text-2xl font-bold'>{product.name}</h1>
        </div>
        <Button>سبد خرید</Button>
      </div>
    </Container>
  );
};

export default Product;
