import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
