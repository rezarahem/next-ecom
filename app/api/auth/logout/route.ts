import { removeCookie } from '@/lib/cookie';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  await removeCookie();
  return NextResponse.json({ message: 'ok' });
};
