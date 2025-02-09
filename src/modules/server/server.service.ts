import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { serverTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';

@Injectable()
export class SenderService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async createSender(data: CreateServerDto) {
    const result = await this.db.insert(serverTable).values(data).returning();
    return result[0];
  }

  async getAllSenders() {
    const sendersList = await this.db.select().from(serverTable);
    return sendersList;
  }

  // async getSender(project_id: number) {
  //   const sender = await this.db
  //     .select()
  //     .from(serverTable)
  //     .where(eq(serverTable.project_id, project_id));
  //   return sender[0];
  // }

//   async updateSender(project_id: number, data: UpdateSenderDto) {
//     const result = await this.db
//       .update(serverTable)
//       .set(data)
//       .where(eq(serverTable.server, server))
//       .returning();
//     return result[0];
//   }

//   async deleteSender(project_id: number): Promise<boolean> {
//     const result = await this.db
//       .delete(senderTable)
//       .where(eq(senderTable.project_id, project_id))
//       .returning();
//     return result.length > 0;
//   }
}
