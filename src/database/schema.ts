import { pgTable, text } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  name: text().notNull(),
  pillar: text({ enum: ['CSD', 'DAI', 'EPD', 'ESD', 'ASD'] }).notNull(),
});
