import { db } from '@/drizzle/db';
import { Category } from '@/drizzle';
import { userAccess } from '@/lib/session';
import { CategoryFormSchema } from '@/zod';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAccess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = await req.json();

  const verifiedFields = CategoryFormSchema.safeParse(data);

  if (!verifiedFields.success || !verifiedFields.data.id) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  const [cat] = await db
    .update(Category)
    .set({
      name: verifiedFields.data.name,
      slug: verifiedFields.data.slug,
      parentId: verifiedFields.data.parentId,
    })
    .where(eq(Category.id, verifiedFields.data.id))
    .returning();

  return NextResponse.json(
    { m: 'دسته‌بندی بروز شد', slug: cat.slug },
    { status: 200 },
  );
};
