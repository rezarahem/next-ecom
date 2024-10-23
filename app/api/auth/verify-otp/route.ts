import { db } from '@/drizzle/db';
import { User } from '@/drizzle/drizzle';
import { utcUnix } from '@/lib/date';
import { SetCookie } from '@/lib/set-cookie';
import { OtpSchema } from '@/zod/zod';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const DIF = +process.env.OTP_AGE!;

const hasOtpExpired = (lastOtpAttempt: string | null) => {
  if (!lastOtpAttempt) return false;

  const dif = Math.round((+utcUnix() - +lastOtpAttempt) / 1000);

  return dif < DIF ? true : false;
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const verifiedFields = OtpSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ message: 'ورودی نامعتبر' }, { status: 404 });
  }

  const [userLoginData] = await db
    .select()
    .from(User)
    .where(eq(User.phone, verifiedFields.data.phoneNumber));

  if (!userLoginData || !userLoginData.otp) {
    return NextResponse.json({ message: 'ورودی نامعتبر' }, { status: 404 });
  }

  const otpAttempt = hasOtpExpired(userLoginData.lastOtpAttempt);

  if (!otpAttempt) {
    return NextResponse.json(
      { message: 'این کد منقضی شده است، مجددا تلاش کنید' },
      { status: 404 }
    );
  }

  const isOtpMatching = +verifiedFields.data.otp === +userLoginData.otp;

  if (!isOtpMatching) {
    return NextResponse.json(
      { message: 'کد نامعتبر، مجددا تلاش کنید' },
      { status: 404 }
    );
  }

  const sessionId = await SetCookie(userLoginData.id);

  await db
    .update(User)
    .set({
      sessionId: sessionId,
    })
    .where(eq(User.id, userLoginData.id));

  return NextResponse.json({ message: 'ورود موفق' });

  // login
};
