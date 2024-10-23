import { Inject, Injectable } from '@nestjs/common';
import * as schemas from 'src/database/schema';
import { DATABASE_CONNECTION } from 'src/database/connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm/expressions';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schemas>,
  ) {}

  async getUsers() {
    return this.database.select().from(schemas.usersTable);
  }

  async findOne(
    username: string,
  ): Promise<void | typeof schemas.usersTable.$inferSelect> {
    const users = await this.database
      .select()
      .from(schemas.usersTable)
      .where(eq(schemas.usersTable.username, username))
      .limit(1);
    const [user] = users;
    if (user) return user;
  }

  async addUser(username: string, password: string) {
    return this.database
      .insert(schemas.usersTable)
      .values({ username: username, password: password });
  }
}
