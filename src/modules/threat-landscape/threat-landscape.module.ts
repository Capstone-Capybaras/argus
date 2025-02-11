import { Module } from '@nestjs/common';
import { ThreatLandscapeService } from './threat-landscape.service';
import { ThreatLandscapeController } from './threat-landscape.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ThreatLandscapeService],
  controllers: [ThreatLandscapeController],
})
export class ThreatLandscapeModule {}
