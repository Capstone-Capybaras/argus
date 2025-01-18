import { IsEmail, IsNumber, IsString } from 'class-validator';
import { participantsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateParticipantDto
  implements InferInsert<typeof participantsTable>
{
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsNumber()
  entity_id: number;
}
