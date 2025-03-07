import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { DatabaseModule } from 'src/database/database.module';
import { AetherModule } from '../aether/aether.module';

@Module({
  imports: [DatabaseModule, AetherModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
