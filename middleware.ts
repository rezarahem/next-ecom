import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (req: NextRequest) => {
  const payload = req.cookies.get(process.env.SESSION_COOKIE_NAME!)?.value;

  const res = NextResponse.next();

  if (payload) {
    res.cookies.set(process.env.SESSION_COOKIE_NAME!, payload, {
      expires: new Date(Date.now() + +process.env.COOKIE_AGE!),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  }

  return res;
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
