import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { BullQueueService } from './bullqueue.service';
import {
  CreateMailDto,
  ScheduleMailDto,
  UpdateMailClient,
  UpdateScheduleDto,
} from './email.dto';

@Controller('emailSchedule')
export class BullQueueController {
  constructor(private readonly bullService: BullQueueService) {}

  @Get('scheduleJob')
  async scheduleJob(@Body() scheduleDto: ScheduleMailDto) {
    // const dummydata = {
    //   from: 'Exercise Control <athenachua27@gmail.com>',
    //   to: ['athenachua27@gmail.com'],
    //   subject: 'Test bull',
    //   html: 'Test Bull Queue Message - scheduled at 12.55am',
    // };
    const sendAt: Date = new Date(scheduleDto.scheduleDateTime);
    const emailId: number = scheduleDto.emailId; //1;
    try {
      // add to emails and schedule database
      const mail = await this.bullService.scheduleEmail(emailId, sendAt);
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
      await this.bullService.updateJob(
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
      const resp = await this.bullService.createEmailSchedule(createEmailDto);
      return resp;
    } catch (err) {
      console.log('error controller in createEmail: ', err);
      throw new InternalServerErrorException(err);
    }
  }

  @Post('editEmail')
  async UpdateMail(@Body() updateMailDto: UpdateMailClient) {
    try {
      const resp = await this.bullService.updateEmailSchedule(updateMailDto);
      return resp;
    } catch (err) {
      console.log('editEmail error controller: ', err);
    }
  }
}
