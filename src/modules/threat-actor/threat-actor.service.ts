import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { threatActorsTable } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateThreatActorDto } from './dto/create-threat-actor.dto';
import { UpdateThreatActorDto } from './dto/update-threat-actor.dto';
import { dtoToInsertModel, dtoToUpdateModel } from 'src/utils/dtoToModel';

@Injectable()
export class ThreatActorService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createThreatActor(data: CreateThreatActorDto) {
    const threatActor = dtoToInsertModel<
      typeof threatActorsTable.$inferInsert,
      CreateThreatActorDto
    >(data);
    const result = await this.db
      .insert(threatActorsTable)
      .values(threatActor)
      .returning();
    return result[0];
  }

  async getAllThreatActors() {
    const threatActors = await this.db.select().from(threatActorsTable);
    return threatActors;
  }

  async getThreatActorById(id: number) {
    const threatActor = await this.db
      .select()
      .from(threatActorsTable)
      .where(eq(threatActorsTable.id, id));
    return threatActor[0];
  }

  async updateThreatActor(id: string, data: UpdateThreatActorDto) {
    const threatActor = dtoToUpdateModel<
      typeof threatActorsTable.$inferInsert,
      UpdateThreatActorDto
    >(data);
    const result = await this.db
      .update(threatActorsTable)
      .set(threatActor)
      .where(eq(threatActorsTable.id, parseInt(id)))
      .returning();
    return result[0];
  }

  async deleteThreatActor(id: number): Promise<boolean> {
    const result = await this.db
      .delete(threatActorsTable)
      .where(eq(threatActorsTable.id, id))
      .returning();
    return result.length > 0;
  }
}
