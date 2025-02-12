import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import * as path from 'path';
import { secretManagerConfig } from './config/secrets';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './modules/project/project.module';
import { EntityModule } from './modules/entity/entity.module';
import { ScenarioModule } from './modules/scenario/scenario.module';
import { InjectsModule } from './modules/injects/injects.module';
import { AssetsModule } from './modules/assets/assets.module';
import { MasterThreatCubesModule } from './modules/master-threat-cubes/master-threat-cubes.module';
import { ParticipantsModule } from './modules/participants/participants.module';
import { ResponsesModule } from './modules/responses/responses.module';
import { RolesModule } from './modules/roles/roles.module';
import { EmailModule } from './email/email.module';
import { BullQueueModule } from './email/bullqueue.module';
import { ImapModule } from './email/imap/imap.module';
import { TtpUsedModule } from './modules/ttp-used/ttp-used.module';
import { ThreatLandscapeModule } from './modules/threat-landscape/threat-landscape.module';
import { TacticsModule } from './modules/tactics/tactics.module';
import { BatchScheduleModule } from './email/batch-schedule/batch-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`),
      ],
      isGlobal: true,
      load: [secretManagerConfig],
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectModule,
    EntityModule,
    ScenarioModule,
    InjectsModule,
    AssetsModule,
    MasterThreatCubesModule,
    ParticipantsModule,
    ResponsesModule,
    RolesModule,
    BullQueueModule,
    EmailModule,
    ImapModule,
    TtpUsedModule,
    ThreatLandscapeModule,
    TacticsModule,
    BatchScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
