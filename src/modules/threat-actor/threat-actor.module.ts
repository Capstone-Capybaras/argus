import { Module } from '@nestjs/common';
import { ThreatActorService } from './threat-actor.service';
import { ThreatActorController } from './threat-actor.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ThreatActorService],
  controllers: [ThreatActorController],
})
export class ThreatActorModule {}
