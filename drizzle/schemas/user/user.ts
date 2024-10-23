import {
  index,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const User = pgTable(
  'user',
  {
    id: serial().primaryKey(),
    name: varchar({ length: 50 }).notNull(),
    phone: varchar({ length: 16 }).unique().notNull(),
    image: varchar({ length: 1024 }),
    otp: varchar({ length: 5 }),
    sessionId: varchar({ length: 2024 }),
    lastOtpAttempt: varchar({ length: 50 }),
    role: varchar({ length: 24 }).notNull().default('user'),
  },
  t => ({
    sessionIdIndex: uniqueIndex().on(t.id, t.sessionId),
  })
);
