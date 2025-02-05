import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { rolesToInjectsTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateRolesToInjectDto } from './dto/create-role-inj.dto';
import { UpdateRolesToInjectDto } from './dto/update-role-inject.dto';

@Injectable()
export class RolesToInjectService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new CII
  async createRolesToInject(data: CreateRolesToInjectDto) {
    const result = await this.db
      .insert(rolesToInjectsTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllRolesToInject() {
    const rolesToInjectList = await this.db.select().from(rolesToInjectsTable);
    return rolesToInjectList;
  }

  async getRolesToInjectById(id: string) {
    const rolesToInject = await this.db
      .select()
      .from(rolesToInjectsTable)
      .where(eq(rolesToInjectsTable.inject_id, id));
    return rolesToInject[0];
  }

  async updateRolesToInject(id: string, data: UpdateRolesToInjectDto) {
    const result = await this.db
      .update(rolesToInjectsTable)
      .set(data)
      .where(eq(rolesToInjectsTable.inject_id, id))
      .returning();
    return result[0];
  }

  async deleteRolesToInject(id: string): Promise<boolean> {
    const result = await this.db
      .delete(rolesToInjectsTable)
      .where(eq(rolesToInjectsTable.inject_id, id))
      .returning();
    return result.length > 0;
  }
}
