import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
