import { cookies } from 'next/headers';
import 'server-only';
import { joseEncrypt } from './jose-encrypt';

export const SetCookie = async (id: number) => {
  const cookieData = await joseEncrypt(id);
  const cookieAge = new Date(Date.now() + +process.env.COOKIE_AGE!);

  (await cookies()).set(process.env.SESSION_COOKIE_NAME!, cookieData, {
    expires: cookieAge,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return cookieData;
};
