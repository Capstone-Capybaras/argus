import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { CIITable } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateCiiDto } from './dto/create-cii.dto';
import { UpdateCiiDto } from './dto/update-cii.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class CiiService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new CII
  async createCII(data: CreateCiiDto) {
    const values = dtoToInsertModel<typeof CIITable.$inferInsert, CreateCiiDto>(
      data,
    );
    const result = await this.db.insert(CIITable).values(values).returning();
    return result[0];
  }

  async getAllCii() {
    const ciiList = await this.db.select().from(CIITable);
    return ciiList;
  }

  async getCiiById(id: number) {
    const cii = await this.db
      .select()
      .from(CIITable)
      .where(eq(CIITable.id, id));
    return cii[0];
  }

  async updateCii(id: string, data: UpdateCiiDto) {
    const values = dtoToUpdateModel<typeof CIITable.$inferInsert, UpdateCiiDto>(
      data,
    );
    const result = await this.db
      .update(CIITable)
      .set(values)
      .where(eq(CIITable.id, parseInt(id)))
      .returning();
    return result[0];
  }

  async deleteCii(id: number): Promise<boolean> {
    const result = await this.db
      .delete(CIITable)
      .where(eq(CIITable.id, id))
      .returning();
    return result.length > 0;
  }
}
