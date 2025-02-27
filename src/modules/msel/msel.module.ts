import { Module } from '@nestjs/common';
import { MselService } from './msel.service';
import { MselController } from './msel.controller';
import { DatabaseModule } from 'src/database/database.module';
import { S3Module } from 'src/email/s3.module';
import { InjectsModule } from '../injects/injects.module';

@Module({
  imports: [S3Module, DatabaseModule, InjectsModule],
  providers: [MselService],
  controllers: [MselController],
})
export class MselModule {}
