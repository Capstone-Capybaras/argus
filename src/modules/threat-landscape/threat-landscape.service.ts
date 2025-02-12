import { Injectable, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { threatLandscapeTable } from '../../database/schema';
import { CreateThreatLandscapeDto } from './dto/create-threat-landscape.dto';
import { UpdateThreatLandscapeDto } from './dto/update-threat-landscape.dto';
import { and, eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/config/providers';

@Injectable()
export class ThreatLandscapeService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create a new threat landscape
  async createThreatLandscape(data: CreateThreatLandscapeDto) {
    const result = await this.db
      .insert(threatLandscapeTable)
      .values(data)
      .returning();
    return result[0]; // Assuming you only want the first inserted record
  }

  // Retrieve all threat landscapes
  async getAllThreatLandscape() {
    const threatLandscape = await this.db.select().from(threatLandscapeTable);
    return threatLandscape;
  }

  // Retrieve specific threat landscapes by entity id
  async getThreatLandscapeByEntityId(entity_id: number) {
    const threatLandscapes = await this.db
      .select()
      .from(threatLandscapeTable)
      .where(eq(threatLandscapeTable.entity_id, entity_id));
    return threatLandscapes;
  }

  // Update a threat landscape by primary key (threat actor name and entity id)
  async updateThreatLandscape(data: UpdateThreatLandscapeDto) {
    const result = await this.db
      .update(threatLandscapeTable)
      .set(data)
      .where(
        and(
          eq(threatLandscapeTable.entity_id, data.entity_id),
          eq(threatLandscapeTable.threat_actor_name, data.threat_actor_name),
        ),
      )
      .returning();
    return result[0] || null;
  }
}
