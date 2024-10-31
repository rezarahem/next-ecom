import { db } from '@/drizzle/db';
import { Category } from '@/drizzle/drizzle';
import { adminAccess } from '@/lib/session';
import { CategoryFormSchema } from '@/zod/zod';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const admin = await adminAccess();

  if (!admin) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = await req.json();

  const verifiedFields = CategoryFormSchema.safeParse(data);

  if (!verifiedFields.success || !verifiedFields.data.id) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  await db
    .update(Category)
    .set({
      name: verifiedFields.data.name,
      addressName: verifiedFields.data.addressName,
      parentId: verifiedFields.data.parentId,
    })
    .where(eq(Category.id, verifiedFields.data.id));

  return NextResponse.json({ m: 'دسته‌بندی بروز شد' }, { status: 200 });
};
