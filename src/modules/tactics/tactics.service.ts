import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { tacticsTable } from '../../database/schema';
import { CreateTacticsDto } from './dto/create-tactics.dto';
import { UpdateTacticsDto } from './dto/update-tactics.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class TacticsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create a new tactic
  async createTactic(data: CreateTacticsDto) {
    const result = await this.db.insert(tacticsTable).values(data).returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  // Retrieve all tactics
  async getAllTactics() {
    const tactics = await this.db.select().from(tacticsTable);
    return tactics;
  }

  // Retrieve a specific tactic by id
  async getTacticById(id: string) {
    const tactic = await this.db
      .select()
      .from(tacticsTable)
      .where(eq(tacticsTable.id, id))
      .limit(1);
    return tactic[0] || null;
  }

  // Update a tactic by id
  async updateTactic(id: string, data: UpdateTacticsDto) {
    const result = await this.db
      .update(tacticsTable)
      .set(data)
      .where(eq(tacticsTable.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteTactic(id: string) {
    const result = await this.db
      .delete(tacticsTable)
      .where(eq(tacticsTable.id, id))
      .returning();
    return result.length > 0;
  }
}
