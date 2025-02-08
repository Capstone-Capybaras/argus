import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Bull, { Queue } from 'bull';
import { EmailService } from './email.service';
import { CreateMailDto, UpdateMailClient, UpdateMailDBDto } from './email.dto';

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
    private readonly emailService: EmailService,
  ) {}

  async scheduleEmail(emailId: number, scheduleDateTime: Date) {
    if (scheduleDateTime.getTime() - Date.now() < 0) {
      throw new Error('Schedule cannot be made in the past');
    } else {
      const job = await this.emailQueue.add(
        'sendEmail',
        { email: emailId },
        {
          delay: scheduleDateTime.getTime() - Date.now(), // Delay the job based on sendAt time
          removeOnComplete: true, // Remove the job after it completes
        },
      );
      console.log('######### PRINT JOB #########');
      console.log(job);
      return { jobId: job.id };
    }
  }

  async updateJob(jobId: number, newEmail: number, newDelay: Date) {
    const job = await this.emailQueue.getJob(jobId);
    if (job) {
      await job.remove();
      const newJob = await this.scheduleEmail(newEmail, newDelay);
      return { jobId: newJob.jobId };
    } else {
      throw new InternalServerErrorException(`No job with ID ${jobId} found`);
    }
  }

  async createEmailSchedule(data: CreateMailDto) {
    try {
      const emailData: CreateMailDto = {
        projectId: data.projectId,
        to: data.to,
        subject: data.subject,
        html: data.html,
        attachments: data.attachments,
      };
      const entry = await this.emailService.addEmail(emailData);
      const emailId = entry[0].id;
      let resp;
      if (data.scheduleDateTime != null) {
        const delay = new Date(data.scheduleDateTime);
        const job = await this.scheduleEmail(entry[0].id, delay);
        const scheduleData: UpdateMailDBDto = {
          job_id: Number(job.jobId),
          schedule_date_time: delay,
          status: 'scheduled',
          error_message: null,
        };
        resp = await this.emailService.updateEmail(emailId, scheduleData);
        console.log('resp:::', resp);
      } else {
        const scheduleData = {
          jobId: null,
          scheduleDateTime: null,
          status: 'notScheduled',
          errorMessage: null,
        };
        resp = await this.emailService.updateEmail(emailId, scheduleData);
      }
      return { success: true, resp: resp };
    } catch (err) {
      console.log('Error creating email:', err);
      throw new InternalServerErrorException(err);
    }
  }

  async updateEmailSchedule(updateMailDto: UpdateMailClient) {
    try {
      let data: UpdateMailDBDto = {
        to: updateMailDto.to,
        subject: updateMailDto.subject,
        html: updateMailDto.html,
        attachments: updateMailDto.attachments,
      };
      let update = await this.emailService.updateEmail(
        updateMailDto.emailId,
        data,
      );
      //check if schedule is the same
      console.log('original date time: ', update.schedule_date_time);
      console.log('new datetime', updateMailDto.scheduleDateTime);
      if (update.schedule_date_time != updateMailDto.scheduleDateTime) {
        let jobId;
        if (update.job_id == null && updateMailDto.scheduleDateTime != null) {
          const delay = new Date(updateMailDto.scheduleDateTime);
          const job = await this.scheduleEmail(updateMailDto.emailId, delay);
          jobId = job.jobId;
        } else if (
          update.job_id != null &&
          updateMailDto.scheduleDateTime != null
        ) {
          const delay = new Date(updateMailDto.scheduleDateTime);
          const newJob = await this.updateJob(
            update.job_id,
            updateMailDto.emailId,
            delay,
          );
          jobId = newJob.jobId;
        }
        const scheduleData: UpdateMailDBDto = {
          job_id: Number(jobId),
          schedule_date_time:
            updateMailDto.scheduleDateTime != null
              ? new Date(updateMailDto.scheduleDateTime)
              : null,
          status: 'scheduled',
        };
        console.log('scheduleData: ', scheduleData);
        const newEmail = await this.emailService.updateEmail(
          updateMailDto.emailId,
          scheduleData,
        );
        update = newEmail;
      }
      return { success: true, resp: update };
    } catch (err) {
      console.log('update email Error', err);
      throw new InternalServerErrorException(err);
    }
  }
}
