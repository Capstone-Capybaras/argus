import { Type } from 'class-transformer';
import { CreateTtpUsedDto } from './create-ttp-used.dto';
import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { SelectTtpUsedDto } from './select-ttp-used.dto';

export class SinglePutTtpUsedDto extends CreateTtpUsedDto {
  // primary key
  @IsInt()
  @IsOptional()
  id?: number;
}

export class BatchUpdateTtpUsedDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SinglePutTtpUsedDto)
  ttps: SinglePutTtpUsedDto[];
}

export interface BatchUpdateTtpUsedResponse {
  success: SelectTtpUsedDto[];
  failed: SinglePutTtpUsedDto[];
  failedMessages: string[];
}
