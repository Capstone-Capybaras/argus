import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError, firstValueFrom } from 'rxjs';
import { AetherGenerateScenarioDto } from './dto/aether-generate-scenario.dto';
import { AxiosError } from 'axios';

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

  async generateScenario(body: AetherGenerateScenarioDto) {
    const token = await this.createToken();

    const { data } = await firstValueFrom(
      this.httpService
        .post('/generate_scenario', body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error?.response?.data);
            throw 'An error happened sending scenario generation request to AI service';
          }),
        ),
    );

    return data;
  }
}
