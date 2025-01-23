import { IsString, IsInt } from 'class-validator';
import { responsesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateResponsesDto implements InferUpdate<typeof responsesTable> {
  @IsString()
  inject_id: string;

  @IsString()
  response: string;

  @IsInt()
  id: number;
}
