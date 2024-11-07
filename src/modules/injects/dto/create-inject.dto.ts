// create-inject.dto.ts
import { IsString, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreateInjectDto {
  @IsString()
  injectId: string;

  @IsString()
  scenarioNumber: string;

  @IsDateString()
  dateTime: Date;

  @IsBoolean()
  injectSent: boolean;

  @IsString()
  injectDesc: string;

  @IsString()
  injectType: string;

  @IsString()
  artefact: string;

  @IsString()
  entity: string;

  @IsString()
  from: string;

  @IsString()
  toRecipient: string;

  @IsString()
  project: string;

  @IsString()
  observation: string;
}
