import { Injectable, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ttpUsedTable } from '../../database/schema';
import { CreateTtpUsedDto } from './dto/create-ttp-used.dto';
import { UpdateTtpUsedDto } from './dto/update-ttp-used.dto';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/config/providers';
import {
  BatchUpdateTtpUsedDto,
  SinglePutTtpUsedDto,
} from './dto/batch-update-ttp-used.dto';
import { SelectTtpUsedDto } from './dto/select-ttp-used.dto';
import { DeepSet } from 'src/utils/DeepSet';

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

  // Retrieve TTPs used by a scenario:
  async getAllTtpUsedByScenario(
    scenario_number: string,
    scenario_project_id: number,
  ) {
    const ttpUsed = await this.db
      .select()
      .from(ttpUsedTable)
      .where(
        and(
          eq(ttpUsedTable.scenario_number, scenario_number),
          eq(ttpUsedTable.scenario_project_id, scenario_project_id),
        ),
      );
    return ttpUsed;
  }

  // Update a TTP used by scenario (s.number + s.project)
  async updateTtpUsed(data: UpdateTtpUsedDto) {
    const result = await this.db
      .update(ttpUsedTable)
      .set(data)
      .where(eq(ttpUsedTable.id, data.id))
      .returning();
    return result[0] || null;
  }

  async batchUpdateTtpUsed(data: BatchUpdateTtpUsedDto) {
    const { ttps } = data;

    const failed: SinglePutTtpUsedDto[] = [];
    const success: SelectTtpUsedDto[] = [];
    const failedMessages: string[] = [];

    const isOneProjectAndScenario =
      new DeepSet(
        ttps.map((t) => ({
          project_id: t.scenario_project_id,
          scenario_number: t.scenario_number,
        })),
      ).size === 1;

    if (!isOneProjectAndScenario) {
      throw new Error(
        'TTP batch update only works when operating within one project ID and one scenario number',
      );
    }

    const { scenario_project_id, scenario_number } = ttps[0];

    return await this.db.transaction(async (tx) => {
      const incomingIds = new Set(
        ttps.map((t) => t.id).filter((o) => o !== undefined),
      );

      // fetch existing ttps for project ID and scenario number
      const existingTtps = await tx
        .select()
        .from(ttpUsedTable)
        .where(
          and(
            eq(ttpUsedTable.scenario_project_id, scenario_project_id),
            eq(ttpUsedTable.scenario_number, scenario_number),
          ),
        );
      const existingIds = new Set(existingTtps.map((t) => t.id));

      // find ttp IDs to delete
      const idsToDelete = Array.from(existingIds.values()).filter(
        (id) => !incomingIds.has(id),
      );
      if (idsToDelete.length > 0) {
        await tx
          .delete(ttpUsedTable)
          .where(inArray(ttpUsedTable.id, idsToDelete));
      }

      // upsert statements
      await Promise.all(
        ttps.map(async (ttp) => {
          try {
            const [result] = await tx
              .insert(ttpUsedTable)
              .values(ttp)
              .onConflictDoUpdate({
                target: ttpUsedTable.id,
                set: {
                  ...ttp,
                  id: sql`${ttpUsedTable.id}`, // leave id as it was
                },
              })
              .returning();
            success.push(result);
          } catch (err) {
            failed.push(ttp);
            failedMessages.push(String(err));
          }
        }),
      );

      return {
        success,
        failed,
        failedMessages,
      };
    });
  }

  // Delete a TTP used by ttp id
  async deleteTtpUsed(id: number) {
    const result = await this.db
      .delete(ttpUsedTable)
      .where(eq(ttpUsedTable.id, id))
      .returning();
    return result.length > 0;
  }
}
