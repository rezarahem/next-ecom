import { db } from '@/drizzle/db';
import { Category } from '@/drizzle/drizzle';
import { checkAdminAccess } from '@/lib/session';
import { CategoryFormSchema } from '@/zod/zod';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const adminAccess = await checkAdminAccess();

  if (!adminAccess) {
    return NextResponse.json({ message: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = await req.json();

  const verifiedFields = CategoryFormSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ message: 'ورودی نامعتبر' }, { status: 400 });
  }

  const [cat] = await db
    .insert(Category)
    .values({
      name: verifiedFields.data.name,
      addressName: verifiedFields.data.addressName,
      parentId: verifiedFields.data.parentId,
    })
    .returning();

  return NextResponse.json(
    { message: 'دسته بندی ایجاد شد', id: cat.id },
    { status: 201 }
  );
};
