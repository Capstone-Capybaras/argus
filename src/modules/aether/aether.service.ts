import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError, firstValueFrom } from 'rxjs';
import { AetherGenerateScenarioDto } from './dto/aether-generate-scenario.dto';
import { AxiosError } from 'axios';
import { AetherGenerateMselDto } from './dto/aether-generate-msel.dto';
import { AetherGenerateThreatLandscapeDto } from './dto/aether-generate-threat.dto';
import {
  AetherChatMessage,
  AetherGenerateChatDto,
} from './dto/aether-generate-chat.dto';
import { AetherScenarioLearningDto } from './dto/aether-scenario-learnings.dto';

interface AetherJwtPayload {
  username: string;
}

/**
 * This service forwards the data to aether
 */
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

  async generateMsel(body: AetherGenerateMselDto) {
    const token = await this.createToken();

    const { data } = await firstValueFrom(
      this.httpService
        .post('/generate_msel', body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error?.response?.data);
            throw 'An error happened sending MSEL generation request to AI service';
          }),
        ),
    );

    return data;
  }

  async generateThreatLandscape(body: AetherGenerateThreatLandscapeDto) {
    const token = await this.createToken();

    const { data } = await firstValueFrom(
      this.httpService
        .post('/generate_threat_landscape', body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error?.response?.data);
            throw 'An error happened sending Threat Landscape generation request to AI service';
          }),
        ),
    );

    return data;
  }

  async saveScenarioLearnings(body: AetherScenarioLearningDto) {
    const token = await this.createToken();

    const { data } = await firstValueFrom(
      this.httpService
        .post('/scenario_learning', body, {
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

  async generateChatMessage(body: AetherGenerateChatDto) {
    const token = await this.createToken();

    const { data } = await firstValueFrom(
      this.httpService
        .post('/api/chat', body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error?.response?.data);
            throw 'An error happened sending chat message generation request to AI service';
          }),
        ),
    );

    // TODO: make sure this is correct
    return data as AetherChatMessage;
  }
}
