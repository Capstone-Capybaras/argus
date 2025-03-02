import { IsString } from 'class-validator';
import { tacticsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateTacticsDto implements InferInsert<typeof tacticsTable> {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  version: string;
}
