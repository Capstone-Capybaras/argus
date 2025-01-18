import { Module } from '@nestjs/common';
import { ProjToThreatActorService } from './proj-to-threat-actor.service';
import { ProjToThreatActorController } from './proj-to-threat-actor.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ProjToThreatActorService],
  controllers: [ProjToThreatActorController],
})
export class ProjToThreatActorModule {}
