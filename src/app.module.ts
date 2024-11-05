import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import { secretManagerConfig } from './config/secrets';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './modules/project/project.module';
import { EntityModule } from './modules/entity/entity.module';
import { ScenarioModule } from './modules/scenario/scenario.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
