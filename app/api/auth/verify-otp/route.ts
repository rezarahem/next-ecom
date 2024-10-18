import { db } from '@/drizzle/db';
import { User } from '@/drizzle/drizzle';
import { OtpSchema } from '@/zod/zod';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const verifiedFields = OtpSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ message: 'ورودی نامعتبر' }, { status: 404 });
  }

  const [userLoginData] = await db
    .select({
      id: User.id,
      otp: User.otp,
      userName: User.name,
      phoneNumber: User.phoneNumber,
    })
    .from(User)
    .where(eq(User.phoneNumber, verifiedFields.data.phoneNumber));

  if (!userLoginData || !userLoginData.otp) {
    return NextResponse.json({ message: 'ورودی نامعتبر' }, { status: 404 });
  }

  const isOtpMatching = +verifiedFields.data.otp === +userLoginData.otp;

  if (!isOtpMatching) {
    return NextResponse.json(
      { message: 'کد نامعتبر، مجددا تلاش کنید' },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: '' });

  // login
};
