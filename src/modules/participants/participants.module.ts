import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { DatabaseModule } from 'src/database/database.module';
import { S3Module } from 'src/email/s3.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [DatabaseModule, S3Module, RolesModule],
  providers: [ParticipantsService],
  controllers: [ParticipantsController],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
