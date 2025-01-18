import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { rolesTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class RolesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new role
  async createRole(data: CreateRoleDto) {
    const values = dtoToInsertModel<
      typeof rolesTable.$inferInsert,
      CreateRoleDto
    >(data);
    const result = await this.db.insert(rolesTable).values(values).returning();
    return result[0];
  }

  async getAllRoles() {
    const rolesList = await this.db.select().from(rolesTable);
    return rolesList;
  }

  async getRoleById(name: string) {
    const role = await this.db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.name, name));
    return role[0];
  }

  async updateRole(name: string, data: UpdateRoleDto) {
    const values = dtoToUpdateModel<
      typeof rolesTable.$inferInsert,
      UpdateRoleDto
    >(data);
    const result = await this.db
      .update(rolesTable)
      .set(values)
      .where(eq(rolesTable.name, name))
      .returning();
    return result[0];
  }

  async deleteRole(name: string): Promise<boolean> {
    const result = await this.db
      .delete(rolesTable)
      .where(eq(rolesTable.name, name))
      .returning();
    return result.length > 0;
  }
}
