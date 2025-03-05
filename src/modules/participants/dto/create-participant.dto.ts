import { IsArray, IsEmail, IsNumber, IsString } from 'class-validator';
import {
  participantsTable,
  participantsToRolesTable,
} from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateParticipantDto
  implements InferInsert<typeof participantsTable>
{
  // core participant information
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  // which entity the participant belongs
  @IsNumber()
  entity_id: number;

  // which (existing) roles the participant has
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}

export class CreateParticipantToRolesDto
  implements InferInsert<typeof participantsToRolesTable>
{
  participant_email: string;
  role_name: string;
  role_entity_id: number;
}
