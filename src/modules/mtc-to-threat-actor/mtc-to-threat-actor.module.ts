import { Module } from '@nestjs/common';
import { MtcToThreatActorService } from './mtc-to-threat-actor.service';
import { MtcToThreatActorController } from './mtc-to-threat-actor.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MtcToThreatActorService],
  controllers: [MtcToThreatActorController],
})
export class MtcToThreatActorModule {}
