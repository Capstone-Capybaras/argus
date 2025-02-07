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
import { CiiModule } from './modules/cii/cii.module';
import { CiiToScenarioModule } from './modules/cii-to-scenario/cii-to-scenario.module';
import { EntToMastThreatCubesModule } from './modules/ent-to-mast-threat-cubes/ent-to-mast-threat-cubes.module';
import { EntToThreatCubesModule } from './modules/ent-to-threat-cubes/ent-to-threat-cubes.module';
import { MasterThreatCubesModule } from './modules/master-threat-cubes/master-threat-cubes.module';
import { MtcToScenarioModule } from './modules/mtc-to-scenario/mtc-to-scenario.module';
import { MtcToThreatActorModule } from './modules/mtc-to-threat-actor/mtc-to-threat-actor.module';
import { PartToRoleModule } from './modules/part-to-role/part-to-role.module';
import { ParticipantsModule } from './modules/participants/participants.module';
import { ResponsesModule } from './modules/responses/responses.module';
import { RolesModule } from './modules/roles/roles.module';
import { RolesToInjectModule } from './modules/roles-to-inject/roles-to-inject.module';
import { ThreatActorModule } from './modules/threat-actor/threat-actor.module';
import { EmailModule } from './email/email.module';
import { BullQueueModule } from './email/bullqueue.module';
import { ImapModule } from './email/imap/imap.module';

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
    CiiModule,
    CiiToScenarioModule,
    EntToMastThreatCubesModule,
    EntToThreatCubesModule,
    MasterThreatCubesModule,
    MtcToScenarioModule,
    MtcToThreatActorModule,
    PartToRoleModule,
    ParticipantsModule,
    ResponsesModule,
    RolesModule,
    RolesToInjectModule,
    ThreatActorModule,
    BullQueueModule,
    EmailModule,
    ImapModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
