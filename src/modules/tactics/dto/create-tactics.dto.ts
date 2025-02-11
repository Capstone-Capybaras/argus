import { IsString } from 'class-validator';
import { tacticsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateTacticsDto implements InferUpdate<typeof tacticsTable> {
  @IsString()
  id: string;

  @IsString()
  name: string;
}
