import { IsOptional, IsString } from 'class-validator';
import { tacticsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateTacticsDto implements InferUpdate<typeof tacticsTable> {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;
}
