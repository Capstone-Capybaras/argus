import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, ValidateNested } from 'class-validator';

export class AetherGenerateChatDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AetherChatMessage)
  messages: AetherChatMessage[];
}

export class AetherChatMessage {
  @IsIn([
    'human',
    'user',
    'ai',
    'assistant',
    'function',
    'tool',
    'system',
    'developer',
  ])
  role:
    | 'human'
    | 'user'
    | 'ai'
    | 'assistant'
    | 'function'
    | 'tool'
    | 'system'
    | 'developer';
  content: string;
}
