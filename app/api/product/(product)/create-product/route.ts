import { db } from '@/drizzle/db';
import { Product, ProductCat, ProductFile } from '@/drizzle';
import { userAccess } from '@/lib/session';
import { ProductFormSchema } from '@/zod';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAccess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const json = await req.json();

  const validatedFields = ProductFormSchema.safeParse(json);

  if (!validatedFields.success) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  const tx = await db.transaction(async (tx) => {
    const {
      buyLimit,
      cats,
      slug,
      desc,
      discount,
      images,
      inventory,
      isActive,
      name,
      price,
      thumb,
    } = validatedFields.data;

    const [product] = await tx
      .insert(Product)
      .values({
        name,
        slug,
        desc,
        price: +price,
        discount: +discount,
        inventory: +inventory,
        isActive,
        thumb,
        buyLimit: +buyLimit,
      })
      .returning();

    if (cats.length > 0) {
      await tx
        .insert(ProductCat)
        .values(cats.map((catId, i) => ({ catId, productId: product.id })));
    }

    if (images.length > 0) {
      await tx
        .insert(ProductFile)
        .values(
          images.map((img, i) => ({ productId: product.id, fileId: img.id })),
        );
    }

    return product;
  });

  if (!tx.id) {
    return NextResponse.json({ m: 'خطای ناشناخته' }, { status: 400 });
  }

  return NextResponse.json(
    { m: 'محصول ایجاد شد', d: { id: tx.id, slug: tx.slug } },
    { status: 201 },
  );
};
