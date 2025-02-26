import { Module } from '@nestjs/common';
import { InjectsService } from './injects.service';
import { InjectsController } from './injects.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EventsModule } from 'src/events/events.module';
import { AetherModule } from '../aether/aether.module';
import { ScenarioModule } from '../scenario/scenario.module';
import { TtpUsedModule } from '../ttp-used/ttp-used.module';
import { EntityModule } from '../entity/entity.module';
import { AssetsModule } from '../assets/assets.module';
import { RolesModule } from '../roles/roles.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [
    DatabaseModule,
    EventsModule,
    AetherModule,
    ScenarioModule,
    TtpUsedModule,
    EntityModule,
    AssetsModule,
    RolesModule,
    JobsModule,
  ],
  providers: [InjectsService],
  controllers: [InjectsController],
  exports: [InjectsService],
})
export class InjectsModule {}
