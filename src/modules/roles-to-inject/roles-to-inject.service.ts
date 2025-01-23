import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { rolesToInjectsTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateRolesToInjectDto } from './dto/create-role-inj.dto';
import { UpdateRolesToInjectDto } from './dto/update-role-inject.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class RolesToInjectService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new CII
  async createRolesToInject(data: CreateRolesToInjectDto) {
    const values = dtoToInsertModel<
      typeof rolesToInjectsTable.$inferInsert,
      CreateRolesToInjectDto
    >(data);
    const result = await this.db
      .insert(rolesToInjectsTable)
      .values(values)
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
    const values = dtoToUpdateModel<
      typeof rolesToInjectsTable.$inferInsert,
      UpdateRolesToInjectDto
    >(data);
    const result = await this.db
      .update(rolesToInjectsTable)
      .set(values)
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
