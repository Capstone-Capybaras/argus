import { IsNotEmpty, IsString, IsInt, IsOptional, IsIn } from 'class-validator';
import { assetsTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateAssetDto implements InferInsert<typeof assetsTable> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  users?: string | null;

  @IsString()
  @IsOptional()
  function?: string | null;

  @IsString()
  @IsOptional()
  sensitive_info?: string | null;

  @IsIn(['IT', 'IOT', 'OT'])
  @IsOptional()
  category?: 'IT' | 'IOT' | 'OT' | null;

  @IsInt()
  entity_id: number;
}
