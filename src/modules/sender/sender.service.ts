import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { senderTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateSenderDto } from './dto/create-sender.dto';
import { UpdateSenderDto } from './dto/update-sender.dto';

@Injectable()
export class SenderService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createSender(data: CreateSenderDto) {
    const result = await this.db.insert(senderTable).values(data).returning();
    return result[0];
  }

  async getAllSenders() {
    const sendersList = await this.db.select().from(senderTable);
    return sendersList;
  }

  async getSender(project_id: number) {
    const sender = await this.db
      .select()
      .from(senderTable)
      .where(eq(senderTable.project_id, project_id));
    return sender[0];
  }

  async updateSender(project_id: number, data: UpdateSenderDto) {
    const result = await this.db
      .update(senderTable)
      .set(data)
      .where(eq(senderTable.project_id, project_id))
      .returning();
    return result[0];
  }

  async deleteSender(project_id: number): Promise<boolean> {
    const result = await this.db
      .delete(senderTable)
      .where(eq(senderTable.project_id, project_id))
      .returning();
    return result.length > 0;
  }
}
