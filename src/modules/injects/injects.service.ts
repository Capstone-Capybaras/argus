// injects.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { injectsTable } from 'src/database/schema';
import { CreateInjectDto } from './dto/create-inject.dto';
import { UpdateInjectDto } from './dto/update-inject.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class InjectsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createInject(data: CreateInjectDto) {
    const values = dtoToInsertModel<
      typeof injectsTable.$inferInsert,
      CreateInjectDto
    >(data);
    const result = await this.db
      .insert(injectsTable)
      .values(values)
      .returning();
    return result[0];
  }

  async getInjects() {
    const injects = await this.db.select().from(injectsTable);
    return injects;
  }

  async getInjectByName(id: string) {
    const inject = await this.db
      .select()
      .from(injectsTable)
      .where(eq(injectsTable.inject_id, id))
      .limit(1);
    return inject[0] || null;
  }

  async updateInject(id: string, data: UpdateInjectDto) {
    const values = dtoToUpdateModel<
      typeof injectsTable.$inferInsert,
      UpdateInjectDto
    >(data);
    const result = await this.db
      .update(injectsTable)
      .set(values)
      .where(eq(injectsTable.inject_id, id))
      .returning();
    return result[0] || null;
  }

  async deleteInject(id: string) {
    const result = await this.db
      .delete(injectsTable)
      .where(eq(injectsTable.inject_id, id))
      .returning();
    return result[0] || null;
  }
}
