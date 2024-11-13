import 'server-only';

import { getCookie } from './cookie';
import { db } from '@/drizzle/db';
import { and, eq } from 'drizzle-orm';
import { User } from '@/drizzle';

export type SessionTypes = {
  name: string;
  phone: string;
  image: string | null;
  role: string;
} | null;

export const userSession = async (): Promise<SessionTypes> => {
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

  return user;
};

export const userAccess = async (roles: string[]): Promise<SessionTypes> => {
  const user = await userSession();

  if (!user) return null;

  const userRoles = [user.role];

  const hasAccess = userRoles.some((r) => roles.includes(r));

  if (!hasAccess) return null;

  return user;
};
