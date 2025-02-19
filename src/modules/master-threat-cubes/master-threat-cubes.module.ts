import { Module } from '@nestjs/common';
import { MasterThreatCubesService } from './master-threat-cubes.service';
import { MasterThreatCubesController } from './master-threat-cubes.controller';
import { DatabaseModule } from 'src/database/database.module';
import { S3Service } from 'src/email/s3.service';

@Module({
  imports: [DatabaseModule],
  providers: [MasterThreatCubesService, S3Service],
  controllers: [MasterThreatCubesController],
  exports:[S3Service]
})
export class MasterThreatCubesModule {}
