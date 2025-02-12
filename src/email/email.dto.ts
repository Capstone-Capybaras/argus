//import { Transform } from 'class-transformer';
import { IsNotEmpty, IsArray, IsDateString } from 'class-validator';
import { emailsTable } from 'src/database/schema';
import { InferInsert, InferUpdate } from 'src/utils/modelToDtoTypes';

export class CreateMailDto implements InferInsert<typeof emailsTable> {
  @IsNotEmpty()
  project_id: number;
  @IsNotEmpty()
  @IsArray()
  to: string[];
  @IsArray()
  cc?: string[];
  @IsArray()
  bcc?: string[];
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

export class UpdateMailDBDto implements InferUpdate<typeof emailsTable> {
  @IsNotEmpty()
  @IsArray()
  to?: string[];
  @IsArray()
  cc?: string[];
  @IsArray()
  bcc?: string[];
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
  @IsArray()
  cc?: string[];
  @IsArray()
  bcc?: string[];
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
