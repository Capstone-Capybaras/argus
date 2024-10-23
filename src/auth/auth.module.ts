import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtConstants),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
