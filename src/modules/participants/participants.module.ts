import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ParticipantsService],
  controllers: [ParticipantsController],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
