import { pgTable, text, serial } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text().notNull().unique(),
  password: text().notNull(),
});
