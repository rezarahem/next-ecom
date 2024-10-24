import 'server-only';

import { getCookie } from './cookie';
import { db } from '@/drizzle/db';
import { and, eq } from 'drizzle-orm';
import { User } from '@/drizzle/drizzle';
import axios from 'axios';

export type SessionTypes = {
  name: string;
  phone: string;
  image: string | null;
  role: string;
  sid: string;
} | null;

export const getSeesion = async (
  updateSession = true
): Promise<SessionTypes> => {
  const cookie = await getCookie();

  if (!cookie) return null;

  const user = await db.query.User.findFirst({
    columns: {
      name: true,
      image: true,
      phone: true,
      role: true,
    },
    where: and(eq(User.id, cookie.userId), eq(User.sessionId, cookie.sid)),
  });

  if (!user) return null;

  // await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/session`, cookie.sid);

  return {
    ...user,
    sid: cookie.sid,
  };
};
