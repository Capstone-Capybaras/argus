import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ttpUsedTable } from '../../database/schema';
import { CreateTtpUsedDto } from './dto/create-ttp-used.dto';
import { UpdateTtpUsedDto } from './dto/update-ttp-used.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class TtpUsedService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create a new TTP used
  async createTtpUsed(data: CreateTtpUsedDto) {
    const result = await this.db.insert(ttpUsedTable).values(data).returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  // Retrieve all TTPs used
  async getAllTtpUsed() {
    const ttpsUsed = await this.db.select().from(ttpUsedTable);
    return ttpsUsed;
  }

  // Retrieve a specific TTP used by scenario_number
  async getTtpUsedById(id: number) {
    const ttpUsed = await this.db
      .select()
      .from(ttpUsedTable)
      .where(eq(ttpUsedTable.project_id, id))
      .limit(1);
    return ttpUsed[0] || null;
  }

  // Update a TTP used by scenario_number
  async updateTtpUsed(id: number, data: UpdateTtpUsedDto) {
    const result = await this.db
      .update(ttpUsedTable)
      .set(data)
      .where(eq(ttpUsedTable.project_id, id))
      .returning();
    return result[0] || null;
  }

  // Delete a TTP used by scenario_number
  async deleteTtpUsed(id: number) {
    const result = await this.db
      .delete(ttpUsedTable)
      .where(eq(ttpUsedTable.project_id, id))
      .returning();
    return result.length > 0;
  }
}
