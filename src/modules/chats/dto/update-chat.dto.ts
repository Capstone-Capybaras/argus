import { IsOptional, IsString, IsUUID } from 'class-validator';
import { chatsTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateChatDto implements InferUpdate<typeof chatsTable> {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;
}
