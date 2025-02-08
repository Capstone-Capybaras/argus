import { entitiesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';
import { SelectParticipantDto } from 'src/modules/participants/dto/select-participant.dto';
import { SelectCIIDto } from 'src/modules/cii/dto/select-cii.dto';

export class SelectEntityDto implements InferSelect<typeof entitiesTable> {
  id: number;
  name: string;
  description: string;
  victim_sector: string;
  critical_function: string;
  policy_documents: string[];
  severity_levels: string | null;

  participants?: SelectParticipantDto[];
  cii?: SelectCIIDto[];
}
