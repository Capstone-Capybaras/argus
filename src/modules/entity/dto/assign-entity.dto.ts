// create-entity.dto.ts
import { IsNumber } from 'class-validator';

export class AssignEntityDto {
  @IsNumber()
  project_id: number;

  @IsNumber()
  entity_id: number;
}
