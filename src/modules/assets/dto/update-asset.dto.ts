import { IsOptional, IsString, IsNumber, IsInt, IsIn } from 'class-validator';
import { assetsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateAssetDto implements InferUpdate<typeof assetsTable> {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  users?: string | null;

  @IsOptional()
  @IsString()
  function?: string | null;

  @IsOptional()
  @IsString()
  sensitive_info?: string | null;

  @IsOptional()
  @IsIn(['IT', 'IOT', 'OT'])
  category?: 'IT' | 'IOT' | 'OT' | null;

  @IsOptional()
  @IsInt()
  entity_id?: number;
}
