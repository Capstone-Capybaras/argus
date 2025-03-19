import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as schemas from 'src/database/schema';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { AttachmentDto, CreateMailDto, UpdateMailDBDto } from './email.dto';
import { RawEmail } from './email.interface';
import { S3Service } from './s3.service';
import { ServerSelectorService } from './server-selector/server-selector.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schemas>,
    private readonly selectorService: ServerSelectorService,
  ) {}

  async getAll() {
    const emails = await this.database.select().from(schemas.emailsTable);
    return emails;
  }
  async getEmailsByProject(projectId: number) {
    const emails = await this.database
      .select()
      .from(schemas.emailsTable)
      .where(eq(schemas.emailsTable.project_id, projectId))
      .orderBy(
        sql`${schemas.emailsTable.schedule_date_time} NULLS FIRST, ${schemas.emailsTable.schedule_date_time} ASC`,
      );

    const headerFooter = await this.database
      .select({
        email_header: schemas.projectsTable.email_header,
        email_footer: schemas.projectsTable.email_footer,
      })
      .from(schemas.projectsTable)
      .where(eq(schemas.projectsTable.id, projectId));
    const results = { headerAndFooter: headerFooter, emails: emails };
    return results;
  }

  async getEmailsById(emailId: number) {
    const email = await this.database
      .select()
      .from(schemas.emailsTable)
      .where(eq(schemas.emailsTable.id, emailId))
      .limit(1);
    return email[0] || null;
  }

  async addEmail(data: CreateMailDto) {
    const result = await this.database
      .insert(schemas.emailsTable)
      .values({
        project_id: data.project_id,
        to: data.to,
        cc: data.cc ?? null,
        bcc: data.bcc ?? null,
        subject: data.subject,
        html: data.html,
        attachments: data.attachments ?? null,
        redis_job_id: data.jobId ?? null,
        schedule_date_time: data.scheduleDateTime
          ? new Date(data.scheduleDateTime)
          : null,
        status: data.status ?? 'notScheduled',
        error_message: data.errorMessage ?? null,
        observations: null,
      })
      .returning({ id: schemas.emailsTable.id });
    return result;
  }

  async updateEmail(emailId: number, data: UpdateMailDBDto) {
    const result = await this.database
      .update(schemas.emailsTable)
      .set(data)
      .where(eq(schemas.emailsTable.id, emailId))
      .returning();
    return result[0] || null;
  }

  async updateStatus(emailId: number, status: string) {
    const result = await this.database
      .update(schemas.emailsTable)
      .set({
        status,
        // whenever status is sent to sent, change is_active to false
        ...(status === 'sent' ? { is_active: false } : {}),
      })
      .where(eq(schemas.emailsTable.id, emailId))
      .returning();
    return result || null;
  }

  async updateErrorMessage(emailId: number, error: string) {
    const result = await this.database
      .update(schemas.emailsTable)
      .set({ error_message: error })
      .where(eq(schemas.emailsTable.id, emailId))
      .returning();
    return result || null;
  }

  async getEmailHeaderFooter(projId: number) {
    const result = await this.database
      .select({
        email_header: schemas.projectsTable.email_header,
        email_footer: schemas.projectsTable.email_footer,
      })
      .from(schemas.projectsTable)
      .where(eq(schemas.projectsTable.id, projId));
    return result.length ? result[0] : null;
  }

  async deleteEmail(emailId: number) {
    const result = await this.database
      .delete(schemas.emailsTable)
      .where(eq(schemas.emailsTable.id, emailId))
      .returning();
    return result || null;
  }

  async deleteEmailByProj(projId: number) {
    try {
      await this.database.transaction(async (tx) => {
        // Start transaction
        const result = await tx // Use tx (transaction object) instead of this.database
          .delete(schemas.emailsTable)
          .where(eq(schemas.emailsTable.project_id, projId))
          .returning();

        return result; // Return the result if the transaction is successful
      });
    } catch (error) {
      console.error('Error deleting emails:', error);
      throw new InternalServerErrorException(error);
    }
  }

  async removeAttachment(emailId: number, fileKey: string) {
    const removed = await this.database
      .update(schemas.emailsTable)
      .set({
        attachments: sql`array_remove(${schemas.emailsTable.attachments}, ${fileKey})`, // PostgreSQL function
      })
      .where(eq(schemas.emailsTable.id, emailId))
      .returning();

    return removed;
  }

  async addAttachment(emailId: number, fileKeys: string[]) {
    const keysArray = fileKeys.map((key) => sql`${key}`);
    await this.database
      .update(schemas.emailsTable)
      .set({
        attachments: sql`COALESCE(array_cat(attachments, ARRAY[${sql.join(keysArray)}]::text[]), ARRAY[]::text[])`,
      })
      .where(eq(schemas.emailsTable.id, emailId));
  }

  async getAttachment(key: string) {
    //download from S3 and put in the form of attachment
    try {
      const bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');
      const fileExists = await this.s3Service.checkFileExists(bucketName, key);
      if (fileExists) {
        const fileBuffer = await this.s3Service.downloadFile(bucketName, key);
        const filename = key.split('/').pop() ?? key;
        const attachment: AttachmentDto = {
          filename: filename,
          content: '',
          encoding: 'base64',
          contentDisposition: 'attachment',
        };
        attachment['content'] = fileBuffer.toString('base64');
        return attachment;
      } else {
        throw new NotFoundException(
          `File with key '${key}' not found in bucket '${bucketName}'.`,
        );
      }
    } catch (err) {
      Logger.error('Error fetching file from S3:', err);
      throw new Error('File fetching failed');
    }
  }

  async sendTest() {
    const transport = await this.selectorService.getEmailConfig();
    const email: RawEmail = {
      from: '<ensign> testing',
      to: ['athena_chua@mymail.sutd.edu.sg'],
      cc: [],
      bcc: [],
      subject: 'testing config email server',
      html: 'this is a test message',
      attachments: [],
      transport: transport,
    };
    const resp = await this.mailService.sendMail(email);
    return { resp: resp };
  }

  async sendMail(emailId: number) {
    if (emailId === null) {
      throw new Error('Email ID is null');
    }
    try {
      const transport = await this.selectorService.getEmailConfig();
      const email: RawEmail = {
        from: '<ensign> testing',
        to: [],
        cc: [],
        bcc: [],
        subject: '',
        html: '',
        attachments: [],
        transport: transport,
      };
      const emailContent = await this.getEmailsById(emailId);
      if (emailContent === null) {
        throw new Error('Email does not exist');
      }
      if (!emailContent.is_active) {
        // if not active, don't send at all
        return;
      }
      const projId = emailContent.project_id;
      const emailHeaderFooter = await this.getEmailHeaderFooter(projId);
      email['to'] = emailContent.to;
      email['subject'] = emailContent.subject;
      if (emailContent.cc !== null) {
        email['cc'] = emailContent.cc;
      }
      if (emailContent.bcc !== null) {
        email['bcc'] = emailContent.bcc;
      }
      //const email_header = "<p style='font-size:24px; font-family:Arialsans-serif; color:red;'>This is a formatted email Header.</p>";
      //const email_footer = "<p style='font-size:12px; font-family:Arial, sans-serif; color:black;'>This is a formatted email body.</p>";
      email['html'] =
        (emailHeaderFooter?.email_header ?? '') +
        '<br>' +
        (emailContent.html ?? '') +
        '<br>' +
        (emailHeaderFooter?.email_footer ?? '');
      if (emailContent.attachments != null) {
        email.attachments = [];
        for (const attachment of emailContent.attachments) {
          try {
            const a = await this.getAttachment(attachment);
            email.attachments.push(a);
          } catch (error) {
            await this.updateStatus(emailId, 'failed');
            await this.updateErrorMessage(emailId, String(error));
            throw new InternalServerErrorException(error);
          }
        }
      }
      const resp = await this.mailService.sendMail(email);
      if (resp) {
        await this.updateStatus(emailId, 'sent');
      }
    } catch (err) {
      console.log('email job sending error: ', err);
      await this.updateStatus(emailId, 'failed');
      await this.updateErrorMessage(emailId, String(err));
      throw new InternalServerErrorException(err);
    }
  }
}
