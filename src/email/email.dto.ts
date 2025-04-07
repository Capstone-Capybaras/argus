//import { Transform } from 'class-transformer';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { emailsTable } from 'src/database/schema';
import {
  InferInsert,
  InferSelect,
  InferUpdate,
} from 'src/utils/modelToDtoTypes';

export class CreateMailDto implements InferInsert<typeof emailsTable> {
  @IsNotEmpty()
  project_id: number;
  @IsNotEmpty()
  @IsArray()
  to: string[];
  @IsArray()
  @IsOptional()
  cc?: string[];
  @IsArray()
  @IsOptional()
  bcc?: string[];
  @IsNotEmpty()
  subject: string;
  @IsNotEmpty()
  html: string;
  @IsOptional()
  attachments?: string[];

  @IsOptional()
  @IsDate()
  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  schedule_date_time?: Date;

  @IsOptional()
  redis_job_id?: string;
  @IsOptional()
  status?: string;
  @IsOptional()
  error_message?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateMailDto implements InferUpdate<typeof emailsTable> {
  id: number;
  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  to?: string[];
  @IsArray()
  @IsOptional()
  cc?: string[];
  @IsArray()
  @IsOptional()
  bcc?: string[];
  @IsNotEmpty()
  @IsOptional()
  subject?: string;
  @IsNotEmpty()
  @IsOptional()
  html?: string;
  @IsOptional()
  attachments?: string[];

  @IsOptional()
  @IsDate()
  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  schedule_date_time?: Date | null;

  @IsOptional()
  redis_job_id?: string | null;
  @IsNotEmpty()
  @IsOptional()
  status?: string;
  @IsOptional()
  error_message?: string | null;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SelectMailDto implements InferSelect<typeof emailsTable> {
  id: number;
  project_id: number;
  to: string[];
  cc: string[] | null;
  bcc: string[] | null;
  subject: string;
  html: string;
  attachments: string[] | null;
  schedule_date_time: Date | null;
  status: string | null;
  redis_job_id: string | null;
  error_message: string | null;
  observations: string | null;
  is_active: boolean;
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
  jobId: string;
  @IsNotEmpty()
  emailId: number;
  @IsNotEmpty()
  scheduleDateTime: Date;
}
