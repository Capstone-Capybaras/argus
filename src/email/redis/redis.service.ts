import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Redis, RedisKey } from 'ioredis';
import { Queue, Worker } from 'bullmq';
import { EmailService } from '../email.service';
import { CreateMailDto, UpdateMailDto } from '../email.dto';

@Injectable()
export class RedisService {
  private jobQueue: Queue;
  constructor(
    @Inject('REDIS_CLUSTER') private readonly redisCluster: Redis,
    private readonly emailService: EmailService,
  ) {
    this.jobQueue = new Queue('{emailQueue}', {
      connection: this.redisCluster, // Use the existing Redis connection
    });
    const worker = new Worker(
      '{emailQueue}',
      async (job) => {
        console.log(`Processing job: ${job.id}`, job.data);
        const emailId = job.data.email;
        this.emailService.sendMail(emailId);
      },
      {
        connection: this.redisCluster, // Ensure workers use the same connection
      },
    );

    worker.on('failed', (job) => {
      console.log(
        `Worker failed on job ID: ${job?.id}\n Job data: ${job?.data}`,
      );
    });
  }

  checkConnection() {
    const status = this.redisCluster.status;
    Logger.log('Valkey Status: ', status);
    return status;
  }

  async reconnect() {
    try {
      await this.redisCluster.connect();
      return 'connected';
    } catch (err) {
      Logger.log('Connection error', err);
      throw new InternalServerErrorException(err);
    }
  }

  async getJobs(
    status: 'all' | 'waiting' | 'active' | 'completed' | 'failed' | 'delayed',
  ) {
    try {
      if (status === 'all') {
        const jobs = await this.jobQueue.getJobs([
          'waiting', // Jobs waiting to be processed
          'active', // Jobs currently being processed
          'completed', // Successfully processed jobs
          'failed', // Jobs that failed
          'delayed', // Jobs that are scheduled for future execution
        ]);
        return jobs;
      } else {
        const jobs = await this.jobQueue.getJobs([status]);
        return jobs;
      }
    } catch (err) {
      Logger.log('Error getting jobs: ', err);
    }
  }

  async addJob(data: any) {
    await this.jobQueue.add('sendEmail', data);
  }

  async scheduleEmail(emailId: number, scheduleDateTime: Date) {
    if (typeof scheduleDateTime === 'string') {
      scheduleDateTime = new Date(scheduleDateTime);
    }
    if (scheduleDateTime.getTime() - Date.now() < 0) {
      console.log(scheduleDateTime);
      console.log(scheduleDateTime.toISOString());
      throw new Error('Schedule cannot be made in the past');
    } else {
      const job = await this.jobQueue.add(
        'sendEmail',
        { email: emailId },
        {
          delay: scheduleDateTime.getTime() - Date.now(), // Delay the job based on sendAt time
          removeOnComplete: true, // Remove the job after it completes
        },
      );
      Logger.log(job.asJSON());
      return { jobId: job.id };
    }
  }

  async removeJob(jobId: string) {
    const job = await this.jobQueue.getJob(jobId);
    if (job) {
      await job.remove();
      return { success: true };
    } else {
      return { success: false, error: `no job with id ${jobId} found` };
    }
  }

  async updateJob(jobId: string, newEmail: number, newDelay: Date) {
    if (typeof newDelay === 'string') {
      newDelay = new Date(newDelay);
    }
    const job = await this.jobQueue.getJob(jobId);
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
        project_id: data.project_id,
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        subject: data.subject,
        html: data.html,
        attachments: data.attachments,
        is_active: data.is_active,
      };
      const entry = await this.emailService.addEmail(emailData);
      const emailId = entry[0].id;
      let resp;
      let date;
      if (data.schedule_date_time != null) {
        if (typeof data.schedule_date_time === 'string') {
          date = new Date(data.schedule_date_time);
        } else {
          date = data.schedule_date_time;
        }
        const delay = data.schedule_date_time;
        const job = await this.scheduleEmail(entry[0].id, delay);
        const updateMailData: UpdateMailDto = {
          id: emailId,
          ...data,
          schedule_date_time: date,
          redis_job_id: job.jobId,
          status: 'scheduled',
        };
        resp = await this.emailService.updateEmail(updateMailData);
      } else {
        const updateMailData: UpdateMailDto = {
          id: emailId,
          ...data,
          schedule_date_time: null,
        };
        resp = await this.emailService.updateEmail(updateMailData);
      }
      return { success: true, resp: resp };
    } catch (err) {
      Logger.log('Error creating email:', err);
      throw new InternalServerErrorException(err);
    }
  }

  async updateEmailSchedule(updateMailDto: UpdateMailDto) {
    if (updateMailDto.schedule_date_time !== undefined) {
      try {
        const current = await this.emailService.getEmailsById(updateMailDto.id);
        console.log('current:', current);
        if (!current) {
          throw new Error('emailService.updateEmail returned undefined');
        }
        let jobId;
        if (
          current.redis_job_id == null &&
          updateMailDto.schedule_date_time != null
        ) {
          const delay = updateMailDto.schedule_date_time;
          const job = await this.scheduleEmail(updateMailDto.id, delay);
          jobId = job.jobId;
        } else if (
          current.redis_job_id != null &&
          updateMailDto.schedule_date_time != null
        ) {
          const delay = updateMailDto.schedule_date_time;
          const newJob = await this.updateJob(
            current.redis_job_id,
            updateMailDto.id,
            delay,
          );
          jobId = newJob.jobId;
        } else if (current.redis_job_id != null && updateMailDto.id == null) {
          await this.removeJob(current.redis_job_id);
          jobId = null;
        }
        let date;
        if (typeof updateMailDto.schedule_date_time === 'string') {
          date = new Date(updateMailDto.schedule_date_time);
        } else {
          date = null;
        }
        const scheduleData: UpdateMailDto = {
          ...updateMailDto,
          redis_job_id: jobId ?? null,
          schedule_date_time: date,
          status: jobId ? 'scheduled' : 'notScheduled',
        };
        console.log('schedule data:', scheduleData);
        const newEmail = await this.emailService.updateEmail(scheduleData);
        return { success: true, email: newEmail };
      } catch (err) {
        Logger.log('update email Error', err);
        throw new InternalServerErrorException(err);
      }
    } else {
      try {
        const newEmail = await this.emailService.updateEmail(updateMailDto);
        return { success: true, email: newEmail };
      } catch (err) {
        Logger.log('update email Error', err);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async deleteScheduleAndEmail(emailId: number) {
    try {
      const email = await this.emailService.getEmailsById(emailId);
      if (email === null) {
        throw new Error('Email does not exist');
      }
      //check schedule
      if (email.redis_job_id !== null) {
        await this.removeJob(email.redis_job_id);
      }
      const result = this.emailService.deleteEmail(emailId);
      return result;
    } catch (err) {
      Logger.log('update email Error', err);
      throw new InternalServerErrorException(err);
    }
  }

  async getRedisItem(key: RedisKey) {
    return this.redisCluster.get(key);
  }

  async setGenerationInput(key: RedisKey, generationInput: object) {
    // keys is a single job ID
    return this.redisCluster.set(key, JSON.stringify(generationInput));
  }

  async deleteRedisItem(key: RedisKey) {
    return this.redisCluster.del(key);
  }
}
