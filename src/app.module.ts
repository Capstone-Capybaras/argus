import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { secretManagerConfig } from './config/secrets';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { EmailsModule } from './emails/emails.module';
import { SnsModule } from './sns.module';

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
    EmailsModule,
    SnsModule,
  ],
  controllers: [],
})
export class AppModule {}
