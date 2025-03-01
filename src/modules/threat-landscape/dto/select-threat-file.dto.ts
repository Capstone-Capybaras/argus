import { threatFilesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectThreatFileDto
  implements InferSelect<typeof threatFilesTable>
{
  entity_id: number;
  file_key: string;
  date_uploaded: Date;
}
