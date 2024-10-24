import { NextRequest } from 'next/server';
import { updateCookie } from './lib/cookie';

export const middleware = async (req: NextRequest) => {
  return await updateCookie(req);
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
