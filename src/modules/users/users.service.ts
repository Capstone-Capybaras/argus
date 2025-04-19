import { Inject, Injectable } from '@nestjs/common';
import * as schemas from 'src/database/schema';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm/expressions';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schemas>,
  ) {}

  async validateSuperUser(username: string): Promise<boolean> {
    const [user] = await this.database
      .select()
      .from(schemas.usersTable)
      .where(eq(schemas.usersTable.username, username))
      .limit(1);

    if (!user) return false;

    return user.is_super_user;
  }

  async getUsers() {
    return this.database
      .select({
        id: schemas.usersTable.id,
        username: schemas.usersTable.username,
        is_active: schemas.usersTable.is_active,
        is_super_user: schemas.usersTable.is_super_user,
      })
      .from(schemas.usersTable);
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

  async addUser(data: CreateUserDto) {
    return this.database.insert(schemas.usersTable).values(data).returning();
  }

  async updateUserByUsername(data: UpdateUserDto) {
    const { username, ...editable } = data;

    return this.database
      .update(schemas.usersTable)
      .set(editable)
      .where(eq(schemas.usersTable.username, username))
      .returning();
  }
}
