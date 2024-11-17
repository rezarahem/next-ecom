import ProductList from '@/components/home/product-list';
import Container from '@/components/ui/container';

const Products = async () => {
  return (
    <Container defaultPY>
      <ProductList />
    </Container>
  );
};

export default Products;
