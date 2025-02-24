import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { RedisService } from './redis.service';
import {
  CreateMailDto,
  ScheduleMailDto,
  UpdateMailClient,
  UpdateScheduleDto,
} from '../email.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('status')
  async getStatus() {
    try {
      const status = this.redisService.checkConnection();
      return status;
    } catch (err) {
      Logger.log('test err: ', err);
    }
  }

  @Get('reconnect')
  async reconnect() {
    try {
      const connection = await this.redisService.reconnect();
      return connection;
    } catch (err) {
      Logger.log('Connection err: ', err);
    }
  }

  @Get('jobs')
  async getJobs() {
    try {
      const status = this.redisService.getJobs("all");
      return status;
    } catch (err) {
      Logger.log('test err: ', err);
    }
  }

  @Post('scheduleJob')
  async scheduleJob(@Body() scheduleDto: ScheduleMailDto) {
    const sendAt: Date = new Date(scheduleDto.scheduleDateTime);
    const emailId: number = scheduleDto.emailId;
    try {
      // add to emails and schedule database
      const mail = await this.redisService.scheduleEmail(emailId, sendAt);
      return {
        message: 'success',
        mail,
      };
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }

  @Post('updateJob')
  async updateJob(@Body() updateDto: UpdateScheduleDto) {
    try {
      await this.redisService.updateJob(
        updateDto.jobId,
        updateDto.emailId,
        updateDto.scheduleDateTime,
      );
    } catch (err) {
      throw new InternalServerErrorException(String(err));
    }
  }

  @Post('createEmail')
  async createEmail(@Body() createEmailDto: CreateMailDto) {
    try {
      const resp = await this.redisService.createEmailSchedule(createEmailDto);
      return resp;
    } catch (err) {
      Logger.log('Error in createEmail: ', err);
      throw new InternalServerErrorException(err);
    }
  }

  @Post('editEmail')
  async UpdateMail(@Body() updateMailDto: UpdateMailClient) {
    try {
      const resp = await this.redisService.updateEmailSchedule(updateMailDto);
      return resp;
    } catch (err) {
      Logger.log('editEmail error controller: ', err);
    }
  }
}
