import ProductList from '@/components/home/product-list';
import Container from '@/components/ui/container';

const Product = async () => {
  return (
    <Container defaultPY>
      <ProductList />
    </Container>
  );
};

export default Product;
