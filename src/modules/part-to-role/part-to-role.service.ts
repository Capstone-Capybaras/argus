import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../database/connection';
import { drizzle } from 'drizzle-orm/node-postgres';
import { participantsToRolesTable } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateParticipantsToRolesDto } from './dto/create-part-role.dto';
import { UpdateParticipantsToRolesDto } from './dto/update-part-role.dto';

@Injectable()
export class PartToRoleService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  // Create new CII
  async createPartRole(data: CreateParticipantsToRolesDto) {
    const result = await this.db
      .insert(participantsToRolesTable)
      .values(data)
      .returning();
    return result[0];
  }

  async getAllPartRoles() {
    const partRoleList = await this.db.select().from(participantsToRolesTable);
    return partRoleList;
  }

  async getPartRoleById(email: string) {
    const partRole = await this.db
      .select()
      .from(participantsToRolesTable)
      .where(eq(participantsToRolesTable.participant_email, email));
    return partRole[0];
  }

  async updatePartRole(email: string, data: UpdateParticipantsToRolesDto) {
    const result = await this.db
      .update(participantsToRolesTable)
      .set(data)
      .where(eq(participantsToRolesTable.participant_email, email))
      .returning();
    return result[0];
  }

  async deletePartRole(email: string): Promise<boolean> {
    const result = await this.db
      .delete(participantsToRolesTable)
      .where(eq(participantsToRolesTable.participant_email, email))
      .returning();
    return result.length > 0;
  }
}
