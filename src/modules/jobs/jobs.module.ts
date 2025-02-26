import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
