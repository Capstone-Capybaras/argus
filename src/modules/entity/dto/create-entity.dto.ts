// create-entity.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateEntityDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  victim_sector: string;

  @IsString()
  CII: string;

  @IsString()
  critical_function: string;

  @IsString()
  policy_documents: string;

  @IsString()
  participants: string; // Add this field
  
  @IsString()
  real_threat_landscape?: string; // Add this field if optional
}
