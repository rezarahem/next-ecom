import 'server-only';

import { getCookie, updateCookie } from './cookie';
import { db } from '@/drizzle/db';
import { and, eq } from 'drizzle-orm';
import { User } from '@/drizzle/drizzle';

export type SessionTypes = {
  name: string;
  phone: string;
  image: string | null;
  role: string;
} | null;

export const getSeesion = async (
  updateSession = true
): Promise<SessionTypes> => {
  const cookie = await getCookie();

  if (!cookie) return null;

  const user = await db.query.User.findFirst({
    columns: {
      // id: true,
      name: true,
      role: true,
      image: true,
      phone: true,
    },
    where: and(eq(User.id, cookie.userId), eq(User.sessionId, cookie.sid)),
  });

  if (!user) return null;

  if (updateSession) await updateCookie(cookie.sid);

  return user;
};
