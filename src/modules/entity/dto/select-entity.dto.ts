import { entitiesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';
import { SelectParticipantDto } from 'src/modules/participants/dto/select-participant.dto';
import { SelectCIIDto } from 'src/modules/cii/dto/select-cii.dto';
import { DeepSet } from 'src/utils/DeepSet';

export class SelectEntityOnlyDto implements InferSelect<typeof entitiesTable> {
  id: number;
  name: string;
  description: string;
  victim_sector: string;
  critical_function: string;
  policy_documents: string;
}

export class SelectEntityDto extends SelectEntityOnlyDto {
  participants?: SelectParticipantDto[];
  cii?: SelectCIIDto[];
}

/**
 * for entity service
 */
export class ISelectEntity extends SelectEntityOnlyDto {
  participants: DeepSet<SelectParticipantDto>;
  cii: DeepSet<SelectCIIDto>;
}
