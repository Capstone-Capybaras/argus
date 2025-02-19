import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JobsService } from './jobs.service';

@Module({
  imports: [DatabaseModule],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
