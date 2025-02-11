import { IsString, IsIn } from 'class-validator';
import { senderTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateSenderDto implements InferUpdate<typeof senderTable> {
  @IsString()
  project_id: number;

  @IsIn(['simx1', 'simx2'])
  server: 'simx1' | 'simx2';
}
