import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { secretManagerConfig } from './config/secrets';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';

console.log(`NODE_ENV sanity check: ${process.env.NODE_ENV}`);
console.log(
  'env file exists:',
  fs.existsSync(
    path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`),
  ),
);

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
