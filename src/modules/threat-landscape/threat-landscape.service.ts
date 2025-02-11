import { Injectable, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { threatLandscapeTable } from '../../database/schema';
import { CreateThreatLandscapeDto } from './dto/create-threat-landscape.dto';
import { UpdateThreatLandscapeDto } from './dto/update-threat-landscape.dto';
import { eq } from 'drizzle-orm';
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

  // Retrieve a specific threat landscape by project_id
  async getThreatLandscapeById(id: number) {
    const threatLandscape = await this.db
      .select()
      .from(threatLandscapeTable)
      .where(eq(threatLandscapeTable.project_id, id))
      .limit(1);
    return threatLandscape[0] || null;
  }

  // Update a threat landscape by project_id
  async updateThreatLandscape(id: number, data: UpdateThreatLandscapeDto) {
    const result = await this.db
      .update(threatLandscapeTable)
      .set(data)
      .where(eq(threatLandscapeTable.project_id, id))
      .returning();
    return result[0] || null;
  }
}
