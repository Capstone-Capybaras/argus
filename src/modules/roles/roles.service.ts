import { Inject, Injectable, Logger } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { rolesTable } from 'src/database/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { CreateRoleDto } from './dto/create-roles.dto';
import {
  BatchUpdateRolesDto,
  BatchUpdateRolesResponse,
  UpdateRoleDto,
} from './dto/update-roles.dto';
import { SelectRoleDto } from './dto/select-roles.dto';

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

  // async updateRole(name: string, data: UpdateRoleDto) {
  //   const result = await this.db
  //     .update(rolesTable)
  //     .set(data)
  //     .where(eq(rolesTable.name, name))
  //     .returning();
  //   return result[0];
  // }

  async deleteRole(name: string, entityId: number): Promise<boolean> {
    const result = await this.db
      .delete(rolesTable)
      .where(and(eq(rolesTable.name, name), eq(rolesTable.entity_id, entityId)))
      .returning();
    return result.length > 0;
  }

  async batchUpdateRoles(
    data: BatchUpdateRolesDto,
  ): Promise<BatchUpdateRolesResponse> {
    const { roles } = data;

    const failed: UpdateRoleDto[] = [];
    const success: SelectRoleDto[] = [];
    const failedMessages: string[] = [];

    const isOneEntity = new Set(roles.map((r) => r.entity_id)).size === 1;

    if (!isOneEntity) {
      throw new Error(
        'batch update only works when operating within one entity ID',
      );
    }

    const entityId = roles[0].entity_id;

    return await this.db.transaction(async (tx) => {
      const incomingNames = new Set(roles.map((r) => r.name));

      // Step 1: Fetch existing role names for that entity
      const existingRoles = await tx
        .select()
        .from(rolesTable)
        .where(eq(rolesTable.entity_id, entityId));
      const existingNames = new Set(existingRoles.map((r) => r.name));

      // Step 2: Identify roles to delete
      const namesToDelete = Array.from(existingNames.values()).filter(
        (name) => !incomingNames.has(name),
      );
      if (namesToDelete.length > 0) {
        Logger.log(
          `Deleting roles for entity ID ${entityId} with names: ${JSON.stringify(namesToDelete)}`,
        );
        await tx
          .delete(rolesTable)
          .where(
            and(
              eq(rolesTable.entity_id, entityId),
              inArray(rolesTable.name, namesToDelete),
            ),
          );
      }

      // upsert statements
      await Promise.all(
        roles.map(async (role) => {
          try {
            const [result] = await tx
              .insert(rolesTable)
              .values(role)
              .onConflictDoUpdate({
                target: [rolesTable.entity_id, rolesTable.name],
                set: {
                  ...role,
                  // leave name and entity id as it was
                  name: sql`${rolesTable.name}`,
                  entity_id: sql`${rolesTable.entity_id}`,
                },
              })
              .returning();
            success.push(result);
          } catch (err) {
            failed.push(role);
            failedMessages.push(String(err));
          }
        }),
      );

      return {
        success,
        failed,
        failedMessages,
      };
    });
  }
}
