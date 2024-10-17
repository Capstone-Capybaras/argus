import { Inject, Injectable } from '@nestjs/common';
import * as schemas from 'src/database/schema';
import { DATABASE_CONNECTION } from 'src/database/connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schemas>,
  ) {}

  async getUsers() {
    return this.database.select().from(schemas.usersTable);
  }
}
