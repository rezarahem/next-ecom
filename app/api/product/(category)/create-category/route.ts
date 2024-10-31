import { db } from '@/drizzle/db';
import { Category } from '@/drizzle/drizzle';
import { adminAccess } from '@/lib/session';
import { CategoryFormSchema } from '@/zod/zod';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const admin = await adminAccess();

  if (!admin) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = await req.json();

  const verifiedFields = CategoryFormSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  const [cat] = await db
    .insert(Category)
    .values({
      name: verifiedFields.data.name,
      addressName: verifiedFields.data.addressName,
      parentId: verifiedFields.data.parentId,
    })
    .returning();

  return NextResponse.json({ m: 'دسته‌بندی ایجاد شد' }, { status: 201 });
};
