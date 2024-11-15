import { db } from '@/drizzle/db';
import { File as FileTable } from '@/drizzle';
import { s3MultiUpload, s3Upload } from '@/lib/s3';
import { userAccess } from '@/lib/session';
import { ProductImgArrSchema } from '@/zod/schemas/product/product';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAccess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = await req.formData();

  const filesArr = data.getAll('images') as File[];

  const validatedFields = ProductImgArrSchema.safeParse(filesArr);

  if (!validatedFields.success) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  // const urls: { url: string }[] = [];
  // for (const file of filesArr) {
  //   try {
  //     const url = await s3Upload(file);
  //     if (url) urls.push({ url });
  //   } catch (error) {}
  // }

  const res = (await s3MultiUpload(filesArr)) as string[];

  const files = await db
    .insert(FileTable)
    .values(res.map((url) => ({ url })))
    .returning();

  return NextResponse.json(
    {
      m: 'آپلود با موفقیت به اتمام رسید',
      files: files.map((f) => ({ ...f, state: 'new' })),
    },
    { status: 200 },
  );
};
