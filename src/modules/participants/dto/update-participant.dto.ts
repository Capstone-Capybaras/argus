import { IsNumber, IsString } from 'class-validator';
import { participantsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class UpdateParticipantDto
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
