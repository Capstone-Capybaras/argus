import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { participantsTable } from 'src/database/schema';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createParticipant(data: CreateParticipantDto) {
    const result = await this.db
      .insert(participantsTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllParticipants() {
    const participants = await this.db.select().from(participantsTable);
    return participants;
  }

  async getParticipantByEmail(email: string) {
    const participant = await this.db
      .select()
      .from(participantsTable)
      .where(eq(participantsTable.email, email))
      .limit(1);
    return participant[0] || null;
  }

  async updateParticipant(email: string, data: UpdateParticipantDto) {
    const result = await this.db
      .update(participantsTable)
      .set(data)
      .where(eq(participantsTable.email, email))
      .returning();
    return result[0] || null;
  }

  async deleteParticipant(email: string) {
    const result = await this.db
      .delete(participantsTable)
      .where(eq(participantsTable.email, email))
      .returning();
    return result.length > 0;
  }
}
