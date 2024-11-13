import { Product } from '@/drizzle';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';

export type ProductBaseType = typeof Product.$inferSelect;
export type ProductType = ProductBaseType & {
  cat: { catId: number }[];
  productFile: {
    file: {
      id: number;
      url: string;
    };
  }[];
};

export const getProductById = async (id: number) => {
  return await db.query.Product.findFirst({
    where: eq(Product.id, id),
    with: {
      cat: {
        columns: {
          catId: true,
        },
      },
      productFile: {
        columns: {},
        with: {
          file: true,
        },
      },
    },
  });
};
