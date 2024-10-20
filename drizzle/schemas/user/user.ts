import { index, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const User = pgTable(
  'user',
  {
    id: serial().primaryKey(),
    name: varchar({ length: 50 }),
    phoneNumber: varchar({ length: 16 }).unique().notNull(),
    image: varchar({ length: 1024 }),
    otp: varchar({ length: 5 }),
    sessionId: varchar({ length: 2024 }).unique(),
    lastOtpAttempt: varchar({ length: 50 }),
    // createdAt: timestamp().notNull(),
    // updatedAt: timestamp().notNull(),
  },
  t => ({
    sessionIdIndex: index().on(t.id, t.sessionId),
  })
);
