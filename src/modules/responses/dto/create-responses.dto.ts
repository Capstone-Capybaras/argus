import { IsString, IsInt } from 'class-validator';
import { responsesTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateResponsesDto implements InferInsert<typeof responsesTable> {
  @IsString()
  inject_id: string;

  @IsString()
  response: string;

  @IsInt()
  id: number;
}
