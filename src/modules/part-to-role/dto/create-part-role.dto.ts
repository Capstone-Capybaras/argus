import { IsString } from 'class-validator';
import { participantsToRolesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateParticipantsToRolesDto
  implements InferUpdate<typeof participantsToRolesTable>
{
  @IsString()
  participant_email: string;

  @IsString()
  role_name: string;
}
