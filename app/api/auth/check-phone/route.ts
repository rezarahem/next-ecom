import { db } from '@/drizzle/db';
import { User } from '@/drizzle/drizzle';
import { generateOtp } from '@/lib/generate-otp';
import { sendOtp } from '@/lib/send-otp';
import { PhoneNumberSchema } from '@/zod/zod';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const verifiedFields = PhoneNumberSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ message: 'ورودی نامعتبر' }, { status: 404 });
  }

  const otp = generateOtp();

  const [user] = await db
    .update(User)
    .set({
      otp,
    })
    .where(eq(User.phoneNumber, verifiedFields.data.phoneNumber))
    .returning();

  if (!user) {
    return NextResponse.json({
      message: 'برای ورود ثبت نام کنید',
      statusCode: 204,
    });
  }

  const res = await sendOtp(verifiedFields.data.phoneNumber, otp);

  if (!res) {
    return NextResponse.json(
      { message: 'خطا در ارسال کد تایید، دقایقی دیگر تلاش کنید' },
      { status: 503 }
    );
  }

  return NextResponse.json({ message: 'کد تایید ارسال شد', statusCode: 200 });
};
