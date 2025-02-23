import { Injectable, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ttpUsedTable } from '../../database/schema';
import { CreateTtpUsedDto } from './dto/create-ttp-used.dto';
import { UpdateTtpUsedDto } from './dto/update-ttp-used.dto';
import { and, eq, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from 'src/config/providers';
import {
  BatchUpdateTtpUsedDto,
  SinglePutTtpUsedDto,
} from './dto/batch-update-ttp-used.dto';
import { SelectTtpUsedDto } from './dto/select-ttp-used.dto';

let test = async () => {
  const failed = [];
  const promise1 = Promise.resolve(3);
  const promise2 = 42;
  try {
    const promise3 = await new Promise((resolve, reject) => {
      setTimeout(reject, 100, 'foo');
    });
  } catch (err) {
    failed.push(err);
  }

  // const values = await Promise.all([promise1, promise2, promise3]);
  // console.log(values);
  return failed;
};

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

    // upsert statements
    await Promise.all(
      ttps.map(async (ttp) => {
        try {
          const [result] = await this.db
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
