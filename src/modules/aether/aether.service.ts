import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AetherJwtPayload {
  username: string;
}

@Injectable()
export class AetherService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  private async createToken(): Promise<string> {
    const payload: AetherJwtPayload = { username: 'argus' };
    return this.jwtService.signAsync(payload);
  }

  async generateScenario() {}
}
