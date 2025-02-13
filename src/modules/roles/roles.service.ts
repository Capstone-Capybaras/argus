import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { rolesTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new role
  async createRole(data: CreateRoleDto) {
    const result = await this.db.insert(rolesTable).values(data).returning();
    return result[0];
  }

  async getAllRolesForEntity(entityId: number) {
    const rolesList = await this.db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.entity_id, entityId));
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
    const result = await this.db
      .update(rolesTable)
      .set(data)
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
