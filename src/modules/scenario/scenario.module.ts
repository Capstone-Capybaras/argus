import { Module } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { ScenarioController } from './scenario.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EntityModule } from '../entity/entity.module';
import { AssetsModule } from '../assets/assets.module';
import { JobsModule } from '../jobs/jobs.module';
import { EventsModule } from 'src/events/events.module';
import { AetherModule } from '../aether/aether.module';

@Module({
  imports: [
    DatabaseModule,
    EntityModule,
    AssetsModule,
    JobsModule,
    EventsModule,
    AetherModule,
  ],
  providers: [ScenarioService],
  controllers: [ScenarioController],
  exports: [ScenarioService],
})
export class ScenarioModule {}
