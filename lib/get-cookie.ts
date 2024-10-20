import 'server-only';
import { cookies } from 'next/headers';
import { joseDecrypt } from './jose-encrypt';

export const GetCookie = async () => {
  const sid = cookies().get(process.env.SESSION_COOKIE_NAME!)?.value;
  if (!sid) return null;
  const userId = await joseDecrypt(sid);
  return { sid, userId };
};
