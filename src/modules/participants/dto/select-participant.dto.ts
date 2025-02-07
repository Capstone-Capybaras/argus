import { participantsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectParticipantDto
  implements InferSelect<typeof participantsTable>
{
  email: string;
  name: string;
  entity_id: number;
}
