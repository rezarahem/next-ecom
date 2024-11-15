import { db } from '@/drizzle/db';
import { Product, ProductCat, ProductFile } from '@/drizzle';
import { userAccess } from '@/lib/session';
import { ProductFormSchema } from '@/zod';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

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
  const {
    id,
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

  if (!id) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  const tx = await db.transaction(async (tx) => {
    const [product] = await tx
      .update(Product)
      .set({
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
      .where(eq(Product.id, id))
      .returning();

    await tx.delete(ProductCat).where(eq(ProductCat.productId, id));

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
    { m: 'محصول بروز شد', d: { id: tx.id, slug: tx.slug } },
    { status: 201 },
  );
};
