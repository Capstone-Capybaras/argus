import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ParticipantsModule } from '../participants/participants.module';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [DatabaseModule, ParticipantsModule, AssetsModule],
  providers: [EntityService],
  controllers: [EntityController],
})
export class EntityModule {}
