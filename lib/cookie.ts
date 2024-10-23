import 'server-only';
import { cookies } from 'next/headers';
import { joseEncrypt } from './jose-encrypt';
import { joseDecrypt } from './jose-encrypt';

export const setCookie = async (id: number) => {
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

export const getCookie = async () => {
  const sid = (await cookies()).get(process.env.SESSION_COOKIE_NAME!)?.value;
  if (!sid) return null;

  const userId = +(await joseDecrypt(sid));
  return { sid, userId };
};

export const updateCookie = async (cookieData: string) => {
  const cookieAge = new Date(Date.now() + +process.env.COOKIE_AGE!);
  (await cookies()).set(process.env.SESSION_COOKIE_NAME!, cookieData, {
    expires: cookieAge,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
};
