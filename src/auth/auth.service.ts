import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(username: string, pass: string): Promise<any> {
        const saltOrRounds = +process.env.SALT_OR_ROUNDS;
        const hash = await bcrypt.hash(pass, saltOrRounds);
        const success = await this.usersService.addUser(username, hash);
    }

    async signIn(username: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findOne(username);
        if (user[0]){
            const isMatch = bcrypt.compare(pass, user[0].password);
            if (!isMatch) {
                throw new UnauthorizedException();
            }
            const payload = { sub: user.userId, username: user.username };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        } else {
            throw new NotFoundException('User not found');
        }
    }
}
