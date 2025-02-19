import { Module } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { ScenarioController } from './scenario.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EntityModule } from '../entity/entity.module';
import { AssetsModule } from '../assets/assets.module';
import { JobsModule } from '../jobs/jobs.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    DatabaseModule,
    EntityModule,
    AssetsModule,
    JobsModule,
    EventsModule,
  ],
  providers: [ScenarioService],
  controllers: [ScenarioController],
})
export class ScenarioModule {}
