import { responsesTable } from 'src/database/schema';
import { InferSelect } from 'src/utils/modelToDtoTypes';

export class SelectResponsesDto implements InferSelect<typeof responsesTable> {
  inject_id: string;
  id: number;
  response: string;
}
