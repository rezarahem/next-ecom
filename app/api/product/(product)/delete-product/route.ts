import { db } from '@/drizzle/db';
import { File, Product } from '@/drizzle';
import { s3MultiDelete } from '@/lib/s3';
import { userAccess } from '@/lib/session';
import { eq, inArray } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAccess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const { id, images } = (await req.json()) as {
    id: number;
    images: { id: number; url: string }[];
  };

  const tx = await db.transaction(async (tx) => {
    if (images.length > 0) {
      const urls = images.map((i) => i.url);
      const imgDel = await s3MultiDelete(urls);

      if (!imgDel) return null;

      tx.delete(File).where(
        inArray(
          File.id,
          images.map((i) => i.id),
        ),
      );
    }

    tx.delete(Product).where(eq(Product.id, id));

    return true;
  });

  if (!tx) {
    return NextResponse.json({ m: 'خطای ناشناخته' }, { status: 400 });
  }

  return NextResponse.json({ m: 'محصول حذف شد' }, { status: 201 });
};
