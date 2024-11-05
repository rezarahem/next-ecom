import { db } from '@/drizzle/db';
import { File as FileTable } from '@/drizzle/drizzle';
import { s3Upload } from '@/lib/s3';
import { userAceess } from '@/lib/session';
import { ProductImgArrSchema } from '@/zod/schemas/product/product';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAceess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = await req.formData();

  const filesArr = data.getAll('images') as File[];

  // return NextResponse.json({ m: true });

  const validatedFields = ProductImgArrSchema.safeParse(filesArr);

  if (!validatedFields.success) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  const urls: { url: string }[] = [];

  for (const file of filesArr) {
    try {
      const url = await s3Upload(file);
      if (url) urls.push({ url });
    } catch (error) {}
  }

  const images = await db.insert(FileTable).values(urls).returning();

  return NextResponse.json(
    { m: 'آپلود با موفقیت به اتمام رسید', images },
    { status: 200 },
  );
};
