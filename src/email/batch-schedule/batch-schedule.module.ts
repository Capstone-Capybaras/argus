import { Module } from '@nestjs/common';
import { BatchScheduleService } from './batch-schedule.service';
import { BatchScheduleController } from './batch-schedule.controller';
import { EmailModule } from '../email.module';
import { S3Module } from '../s3.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule, EmailModule, S3Module],
  providers: [BatchScheduleService],
  controllers: [BatchScheduleController],
})
export class BatchScheduleModule {}
