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
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ParticipantWithRoles } from './dto/select-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
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
}
