import { Module } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { ScenarioController } from './scenario.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EntityModule } from '../entity/entity.module';
import { AssetsModule } from '../assets/assets.module';
import { JobsModule } from '../jobs/jobs.module';
import { EventsModule } from 'src/events/events.module';
import { AetherModule } from '../aether/aether.module';
import { ThreatLandscapeModule } from '../threat-landscape/threat-landscape.module';
import { MasterThreatCubesModule } from '../master-threat-cubes/master-threat-cubes.module';

@Module({
  imports: [
    DatabaseModule,
    EntityModule,
    AssetsModule,
    JobsModule,
    EventsModule,
    AetherModule,
    ThreatLandscapeModule,
    MasterThreatCubesModule
  ],
  providers: [ScenarioService],
  controllers: [ScenarioController],
  exports: [ScenarioService],
})
export class ScenarioModule {}
