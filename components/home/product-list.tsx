import { getAllActiveProducts } from '@/query/product/product';
import ProductCard from './product-card';

const ProductList = async () => {
  const products = await getAllActiveProducts();
  return (
    <section className='grid grid-cols-5 gap-2'>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
};

export default ProductList;
