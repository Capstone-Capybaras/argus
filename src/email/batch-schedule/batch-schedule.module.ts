import { Module } from '@nestjs/common';
import { BatchScheduleService } from './batch-schedule.service';
import { BatchScheduleController } from './batch-schedule.controller';
import { BullQueueModule } from '../bullqueue.module';
import { EmailModule } from '../email.module';
import { S3Module } from '../s3.module';

@Module({
  imports: [BullQueueModule, EmailModule, S3Module],
  providers: [BatchScheduleService],
  controllers: [BatchScheduleController],
})
export class BatchScheduleModule {}
