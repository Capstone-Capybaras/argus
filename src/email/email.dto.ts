import { Transform } from 'class-transformer';
import { IsNotEmpty, IsArray, IsOptional, IsDateString } from 'class-validator';

export class CreateMailDto {
  @IsNotEmpty()
  projectId: number;
  @IsNotEmpty()
  @IsArray()
  to: string[];
  @IsArray()
  cc?: string[];
  @IsNotEmpty()
  subject: string;
  @IsNotEmpty()
  html: string;
  attachments?: string[];
  // @Transform(({ value }) => value === "" ? null : value)
  @IsDateString()
  scheduleDateTime?: string | null;
  jobId?: number | null;
  status?: string;
  errorMessage?: string | null;
}

export class UpdateMailDBDto {
  @IsNotEmpty()
  @IsArray()
  to?: string[];
  @IsArray()
  cc?: string[];
  @IsNotEmpty()
  subject?: string;
  @IsNotEmpty()
  html?: string;
  attachments?: string[];
  schedule_date_time?: Date | null;
  job_id?: number | null;
  @IsNotEmpty()
  status?: string;
  error_message?: string | null;
}

export class UpdateMailClient {
  @IsNotEmpty()
  emailId: number;
  projectId?: number;
  @IsNotEmpty()
  @IsArray()
  to?: string[];
  @IsNotEmpty()
  subject?: string;
  @IsNotEmpty()
  html?: string;
  attachments?: string[];
  // @Transform(({ value }) => value === "" ? null : value)
  // @IsDateString()
  scheduleDateTime?: string | null;
  jobId?: number | null;
  status?: string;
  errorMessage?: string | null;
}

export class AttachmentDto {
  filename: string;
  content: string;
  encoding: string;
  contentDisposition?: 'attachment' | 'inline' | undefined;
}

export class SendMailDto {
  to: string[];
  subject: string;
  html: string;
  attachments?: AttachmentDto[];
}

export class ScheduleMailDto {
  @IsNotEmpty()
  emailId: number;
  @IsNotEmpty()
  scheduleDateTime: Date;
}

export class UpdateScheduleDto {
  @IsNotEmpty()
  jobId: number;
  @IsNotEmpty()
  emailId: number;
  @IsNotEmpty()
  scheduleDateTime: Date;
}
