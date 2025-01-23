import { Module } from '@nestjs/common';
import { PartToRoleService } from './part-to-role.service';
import { PartToRoleController } from './part-to-role.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PartToRoleService],
  controllers: [PartToRoleController],
})
export class PartToRoleModule {}
