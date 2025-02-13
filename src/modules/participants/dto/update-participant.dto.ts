import { IsEmail, IsOptional, IsString } from 'class-validator';
import { participantsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateParticipantDto
  implements InferUpdate<typeof participantsTable>
{
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;
}
