import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../../config/providers';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq, inArray, sql } from 'drizzle-orm';
import {
  entitesToParticipantsTable,
  entitiesTable,
  participantsTable,
  participantsToRolesTable,
  projectsToEntitiesTable,
  rolesTable,
} from 'src/database/schema';
import {
  CreateParticipantDto,
  CreateParticipantToRolesDto,
} from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ParticipantWithRoles } from './dto/select-participant.dto';
import { ConfigService } from '@nestjs/config';
import * as XLSX from 'xlsx';
import { S3Service } from 'src/email/s3.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class ParticipantsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly rolesService: RolesService,
  ) {}

  async createParticipant(
    data: CreateParticipantDto,
  ): Promise<ParticipantWithRoles> {
    // when creating a participant we need to do multiple things, so use a SQL transaction
    return this.db.transaction(async (tx) => {
      // 1) update base participant table
      const [participant] = await tx
        .insert(participantsTable)
        .values({
          email: data.email,
          name: data.name,
        })
        .returning();

      // 2) tag participant to entity
      await tx.insert(entitesToParticipantsTable).values({
        participant_email: data.email,
        entity_id: data.entity_id,
      });

      // 3) tag participant to role(s)
      await Promise.all(
        data.roles.map((role) =>
          tx.insert(participantsToRolesTable).values({
            participant_email: data.email,
            role_name: role,
            role_entity_id: data.entity_id,
          }),
        ),
      );

      // we can just return the object like this because once code reaches here
      // guaranteed successful insertion for all 3 tables above
      return {
        ...participant,
        roles: data.roles,
        entity_id: data.entity_id,
      };
    });
  }

  // whenever we query for participants, we should return their roles as well
  async getAllParticipantsByEntity(entityId: number) {
    const participant_emails = this.db
      .$with('participant_emails')
      .as(
        this.db
          .select()
          .from(entitesToParticipantsTable)
          .where(eq(entitesToParticipantsTable.entity_id, entityId)),
      );

    const rows = await this.db
      .with(participant_emails)
      .select()
      .from(participant_emails)
      .leftJoin(
        participantsToRolesTable,
        eq(
          participant_emails.participant_email,
          participantsToRolesTable.participant_email,
        ),
      )
      .leftJoin(
        participantsTable,
        eq(participantsTable.email, participant_emails.participant_email),
      );

    if (rows.length === 0) return [];

    const visitedEmails = new Set<string>();
    return rows.reduce<ParticipantWithRoles[]>((acc, row) => {
      const { participants_to_roles, participant_emails, participants } = row;

      if (!participants) return acc;

      if (!visitedEmails.has(participant_emails.participant_email)) {
        acc.push({
          roles: [],
          email: participant_emails.participant_email,
          entity_id: participant_emails.entity_id,
          name: participants.name,
        });
        visitedEmails.add(participant_emails.participant_email);
      }

      if (!participants_to_roles) return acc;

      acc
        .find((p) => p.email === participants.email)
        ?.roles.push(participants_to_roles.role_name);

      return acc;
    }, [] as ParticipantWithRoles[]);
  }

  // whenever we query for participants, we should return their roles as well
  async getParticipantByEmailAndEntity(email: string, entityId: number) {
    const participant = this.db.$with('participant').as(
      this.db
        .select()
        .from(entitesToParticipantsTable)
        .where(
          and(
            eq(entitesToParticipantsTable.entity_id, entityId),
            eq(entitesToParticipantsTable.participant_email, email),
          ),
        )
        .limit(1),
    );

    const rows = await this.db
      .with(participant)
      .select()
      .from(participant)
      .leftJoin(
        participantsToRolesTable,
        eq(
          participant.participant_email,
          participantsToRolesTable.participant_email,
        ),
      )
      .leftJoin(
        participantsTable,
        eq(participantsTable.email, participant.participant_email),
      );

    if (rows.length === 0) return;

    return rows.reduce<ParticipantWithRoles>((acc, row) => {
      const {
        participants_to_roles,
        participant,
        participants: participant_info,
      } = row;

      if (!participant_info) return acc;

      if (!acc.email) {
        acc = {
          roles: [],
          email: participant.participant_email,
          entity_id: participant.entity_id,
          name: participant_info.name,
        };
      }

      if (!participants_to_roles) return acc;

      acc.roles.push(participants_to_roles.role_name);

      return acc;
    }, {} as ParticipantWithRoles);
  }

  async addParticipantToRole(email: string, role: string, entity_id: number) {
    const data: CreateParticipantToRolesDto = {
      participant_email: email,
      role_name: role,
      role_entity_id: entity_id,
    };
    const result = await this.db
      .insert(participantsToRolesTable)
      .values(data)
      .returning();
    return result;
  }

  async addParticipantToEntity(email: string, entity_id: number) {
    const result = await this.db
      .insert(entitesToParticipantsTable)
      .values({ participant_email: email, entity_id: entity_id })
      .returning();
    return result;
  }

  async getParticipantsByProject(project_id: number) {
    const results = await this.db
      .select({
        email: participantsTable.email,
        entity: entitiesTable.name,
        roles: sql<string>`string_agg(${rolesTable.name},',')`.mapWith(
          (value) => (value ? value.split(',') : []),
        ),
      })
      .from(participantsTable)
      .innerJoin(
        participantsToRolesTable,
        eq(participantsTable.email, participantsToRolesTable.participant_email),
      )
      .innerJoin(
        rolesTable,
        and(
          eq(participantsToRolesTable.role_name, rolesTable.name),
          eq(participantsToRolesTable.role_entity_id, rolesTable.entity_id),
        ),
      )
      .innerJoin(entitiesTable, eq(rolesTable.entity_id, entitiesTable.id))
      .innerJoin(
        projectsToEntitiesTable,
        and(
          eq(entitiesTable.id, projectsToEntitiesTable.entity_id),
          eq(projectsToEntitiesTable.project_id, project_id),
        ),
      ) // Join with projectsToEntities
      .groupBy(participantsTable.email, entitiesTable.name)
      .execute();

    return results;
  }

  async updateParticipant(data: UpdateParticipantDto) {
    // validate that input role names exist in the role table (for that entity)
    if (data.roles) {
      const rows = await this.db
        .select()
        .from(rolesTable)
        .where(
          and(
            inArray(rolesTable.name, data.roles),
            eq(rolesTable.entity_id, data.entity_id),
          ),
        );

      if (rows.length < data.roles.length) {
        throw new Error('Some roles given do not exist for this entity');
      }
    }

    // note: always scoped within entity
    return this.db.transaction(async (tx) => {
      // update base participant (only name column can be updated)
      const [participant] = await tx
        .update(participantsTable)
        .set({
          name: data.name,
        })
        .where(eq(participantsTable.email, data.email))
        .returning();

      if (data.roles) {
        // find what roles the participant has for this entity
        const existingRoles = await tx
          .select()
          .from(participantsToRolesTable)
          .where(
            and(
              eq(participantsToRolesTable.participant_email, data.email),
              eq(participantsToRolesTable.role_entity_id, data.entity_id),
            ),
          );

        // find out what roles to delete from participant
        const roleIdsToDelete = existingRoles
          .filter((role) => !data.roles!.includes(role.role_name))
          .map((r) => r.id);
        await tx
          .delete(participantsToRolesTable)
          .where(inArray(participantsToRolesTable.id, roleIdsToDelete));

        // find out what roles to insert for participant
        const existingRoleNames = existingRoles.map((r) => r.role_name);
        const roleNamesToInsert = data.roles.filter(
          (role) => !existingRoleNames.includes(role),
        );

        if (roleNamesToInsert.length > 0) {
          await tx.insert(participantsToRolesTable).values(
            roleNamesToInsert.map((r) => ({
              participant_email: data.email,
              role_entity_id: data.entity_id,
              role_name: r,
            })),
          );
        }

        return {
          ...participant,
          roles: data.roles,
          entity_id: data.entity_id,
        };
      }
    });
  }

  /**
   * Unlink these two by removing entry from join table. No real delete is done
   */
  async deleteParticipantFromEntity(email: string, entityId: number) {
    const result = await this.db
      .delete(entitesToParticipantsTable)
      .where(
        and(
          eq(entitesToParticipantsTable.entity_id, entityId),
          eq(entitesToParticipantsTable.participant_email, email),
        ),
      )
      .returning();
    return result.length > 0;
  }

  private isValidEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private getSheetHeaders(worksheet: XLSX.WorkSheet): {
    headers: string[];
    range: number;
  } {
    const headers: string[] = [];
    if (!worksheet['!ref']) {
      throw new Error(
        'Sheet reference (!ref) is missing. The sheet might be empty.',
      );
    }
    const range = XLSX.utils.decode_range(worksheet['!ref']); // Get the data range
    //check if first row is empty
    const addr = XLSX.utils.encode_cell({ r: range.s.r, c: range.s.c });
    const cell = worksheet[addr];
    let start;
    if (cell) {
      start = 0;
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          headers.push(cell.v.toString().trim()); // Convert to string and trim spaces
        }
      }
    } else {
      start = 1;
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: range.s.r + 1,
          c: col,
        });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          headers.push(cell.v.toString().trim()); // Convert to string and trim spaces
        }
      }
    }
    return { headers: headers, range: start };
  }

  async uploadParticipants(file_key: string, entity_id: number) {
    const bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');
    const fileBuffer = await this.s3Service.downloadFile(bucketName, file_key);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const errors: string[] = [];
    interface Row {
      'TTX Exercise Role': string;
      Email: string;
      'Participant Name': string;
    }
    console.log('sheet names: ', workbook.SheetNames);
    if (!workbook.SheetNames.includes('Participants List')) {
      errors.push(
        "The uploaded Excel file must contain a sheet named 'Participants List'.",
      );
      return { success: false, errors: errors };
      //throw new Error('The uploaded Excel file must contain a sheet named "msel".');
    }
    const worksheet = workbook.Sheets['Participants List'];
    const requiredColumns = ['TTX Exercise Role', 'Email', 'Participant Name'];
    try {
      const { headers, range } = this.getSheetHeaders(worksheet);
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col),
      );
      if (missingColumns.length > 0) {
        errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
        return { success: false, errors: errors };
      }
      const rows: Row[] = XLSX.utils.sheet_to_json(worksheet, {
        range: range,
        defval: null,
      });
      //check for all emails to be valid and no duplicate
      const exists: string[] = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (
          row['TTX Exercise Role'] === null &&
          row['Participant Name'] === null &&
          row['Email'] === null
        ) {
          continue;
        }
        if (row['TTX Exercise Role'] === null) {
          errors.push(
            `TTX Exercise Role fields cannot be empty! empty field at row ${i + 2}`,
          );
        }
        if (row['Participant Name'] === null) {
          errors.push(
            `Participant Name fields cannot be empty! empty field at row ${i + 2}`,
          );
        }
        if (row['Email'] === null) {
          errors.push(
            `Email fields cannot be empty! empty field at row ${i + 2}`,
          );
        } else {
          const valid = this.isValidEmail(row['Email']);
          if (!valid) {
            errors.push(
              `Email field contains an invalid email at row ${i + 2}`,
            );
          } else {
            if (exists.includes(row['Email'])) {
              errors.push(
                `Duplicate emails found at row ${i + 2}. Sheet should not have duplicate emails. If participant has multiple roles, separate their roles with ";"`,
              );
            } else {
              exists.push(row['Email']);
            }
          }
        }
      }
      if (errors.length > 0) {
        return { success: false, errors: errors };
      }
      //insert into db
      await this.db.transaction(async (tx) => {
        for (const row of rows) {
          const newRoles = row['TTX Exercise Role']
            .split(';')
            .map((role) => role.trim());
          // Ensure roles exist in the entity
          for (const role of newRoles) {
            await tx
              .insert(rolesTable)
              .values({ name: role, entity_id })
              .onConflictDoNothing();
          }
          // Insert participant, dont insert if already exists
          await tx
            .insert(participantsTable)
            .values({
              email: row['Email'],
              name: row['Participant Name'],
            })
            .onConflictDoNothing();
          // Ensure participant is linked to entity
          await tx
            .insert(entitesToParticipantsTable)
            .values({
              participant_email: row['Email'],
              entity_id: entity_id,
            })
            .onConflictDoNothing();
          // Assign roles to participant
          for (const role of newRoles) {
            await tx
              .insert(participantsToRolesTable)
              .values({
                participant_email: row['Email'],
                role_name: role,
                role_entity_id: entity_id,
              })
              .onConflictDoNothing();
          }
        }
      });
      return { success: true };
    } catch (error) {
      errors.push(error as string);
      console.log(error);
      return { success: false, errors: errors };
    }
  }
}
