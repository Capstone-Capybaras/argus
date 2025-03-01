import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { entitiesTable, projectsTable } from 'src/database/schema';

export class GenerateThreatDto {
  @IsInt()
  @IsNotEmpty()
  project_id: typeof projectsTable.$inferSelect.id;

  @IsInt()
  @IsNotEmpty()
  entity_id: typeof entitiesTable.$inferSelect.id;

  @IsString()
  @IsNotEmpty()
  file_key: string;
}
