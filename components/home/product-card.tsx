import { ProductTypesWithImage } from '@/query';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

type ProductCardProps = {
  product: ProductTypesWithImage;
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className='flex flex-col gap-2 rounded-md border p-2'>
      <div className='relative aspect-square'>
        <Image
          src={product.thumb as string}
          className='rounded-md'
          fill
          sizes='50vw'
          alt={product.name}
        />
      </div>
      <div className='flex items-center justify-between'>
        <div className='text-sm font-semibold'>{product.name}</div>
        <Link href={`products/${product.id}/${product.slug}`}>
          <Button>سفارش</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
