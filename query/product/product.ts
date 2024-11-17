import 'server-only';
import { Product } from '@/drizzle';
import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';

export type ProductBaseType = typeof Product.$inferSelect;

export type ProductTypesWithImage = ProductBaseType & {
  productFile: {
    file: {
      id: number;
      url: string;
    };
  }[];
};

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

export const getAllProducts = async () => {
  return await db.query.Product.findMany({
    with: {
      productFile: {
        columns: {},
        with: {
          file: true,
        },
      },
    },
  });
};

export const getAllActiveProducts = async () => {
  return await db.query.Product.findMany({
    where: eq(Product.isActive, true),
    with: {
      productFile: {
        columns: {},
        with: {
          file: true,
        },
      },
    },
  });
};
