import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { responsesTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateResponsesDto } from './dto/create-responses.dto';
import { UpdateResponsesDto } from './dto/update-responses.dto';

@Injectable()
export class ResponsesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new response
  async createResponse(data: CreateResponsesDto) {
    const result = await this.db
      .insert(responsesTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllResponses() {
    const responsesList = await this.db.select().from(responsesTable);
    return responsesList;
  }

  async getResponseById(id: number) {
    const response = await this.db
      .select()
      .from(responsesTable)
      .where(eq(responsesTable.id, id));
    return response[0];
  }

  async updateResponse(id: number, data: UpdateResponsesDto) {
    const result = await this.db
      .update(responsesTable)
      .set(data)
      .where(eq(responsesTable.id, id))
      .returning();
    return result[0];
  }

  async deleteResponse(id: number): Promise<boolean> {
    const result = await this.db
      .delete(responsesTable)
      .where(eq(responsesTable.id, id))
      .returning();
    return result.length > 0;
  }
}
