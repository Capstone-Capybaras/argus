import { IsString, IsIn } from 'class-validator';
import { serverTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateServerDto implements InferUpdate<typeof serverTable> {

  @IsIn(['simx1', 'simx2'])
  server: 'simx1' | 'simx2';
}
