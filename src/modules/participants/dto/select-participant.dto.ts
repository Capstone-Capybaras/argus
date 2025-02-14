import { participantsTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectParticipantDto
  implements InferSelect<typeof participantsTable>
{
  email: string;
  name: string;
}

export class ParticipantWithRoles extends SelectParticipantDto {
  entity_id: number;
  roles: string[];
}
