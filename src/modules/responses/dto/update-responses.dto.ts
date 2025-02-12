import { IsString, IsInt, IsOptional } from 'class-validator';
import { responsesTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateResponsesDto implements InferUpdate<typeof responsesTable> {
  @IsString()
  @IsOptional()
  inject_id?: string;

  @IsString()
  @IsOptional()
  response?: string;

  @IsInt()
  id: number;
}
