import { pgTable, text, serial, timestamp, char } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text().notNull().unique(),
  password: text().notNull(),
});

export const revokedTokensTable = pgTable('revoked_tokens', {
  token_hash: char({ length: 64 }).notNull().unique().primaryKey(),
  revoked_at: timestamp().defaultNow(),
});
