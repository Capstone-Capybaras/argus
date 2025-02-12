import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as schemas from 'src/database/schema';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { AttachmentDto, CreateMailDto, UpdateMailDBDto } from './email.dto';
import { RawEmail } from './email.interface';
import { S3Service } from './s3.service';
import { ServerSelectorService } from './server-selector/server-selector.service';

@Injectable()
export class EmailService {
  constructor(
    //@Inject(forwardRef(() => BullQueueService))
    //private readonly bullQueueService: BullQueueService,
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
    //return this.database.select().from(schemas.emailsTable);
    const emails = await this.database
      .select()
      .from(schemas.emailsTable)
      .where(eq(schemas.emailsTable.project_id, projectId));
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
    //return this.database.select().from(schemas.emailsTable);
    const email = await this.database
      .select()
      .from(schemas.emailsTable)
      .where(eq(schemas.emailsTable.id, emailId))
      .limit(1);
    return email[0] || null;
  }

  async addEmail(data: CreateMailDto) {
    const result = this.database
      .insert(schemas.emailsTable)
      .values({
        project_id: data.project_id,
        to: data.to,
        cc: data.cc ?? null,
        bcc: data.bcc ?? null,
        subject: data.subject,
        html: data.html,
        attachments: data.attachments ?? null,
        job_id: data.jobId ?? null,
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
      .set({ status: status })
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
    const result = await this.database
      .delete(schemas.emailsTable)
      .where(eq(schemas.emailsTable.project_id, projId))
      .returning();
    return result || null;
  }

  // async connectToInbox() {
  //   try {
  //     const imapConfig = await getImapConfig(this.configService);
  //     const connection = await imapSimple.connect(imapConfig);

  //     // Open the inbox
  //     await connection.openBox('INBOX');
  //     console.log('Connected to INBOX');

  //     return connection;
  //   } catch (error) {
  //     console.error('Error connecting to inbox:', error);
  //     throw error;
  //   }
  // }

  async getAttachment(key: string) {
    //download from S3 and put in the form of attachment
    try {
      const bucketName = 'eep-argus-staging';
      const fileBuffer = await this.s3Service.downloadFile(bucketName, key);
      const filename = key.split('/').pop() ?? key;
      const attachment: AttachmentDto = {
        filename: filename,
        content: '',
        encoding: 'base64',
        contentDisposition: 'attachment',
      };
      attachment['content'] = fileBuffer.toString('base64');
      console.log('attachment');
      return attachment;
    } catch (err) {
      console.error('Error fetching file from S3:', err);
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
      console.log('email Content:', emailContent);
      const projId = emailContent.project_id;
      const emailHeaderFooter = await this.getEmailHeaderFooter(projId);
      console.log('email from db:', emailContent);
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
        console.log('inside content attachment loop');
        email.attachments = [];
        for (const attachment of emailContent.attachments) {
          const a = await this.getAttachment(attachment);
          email.attachments.push(a);
        }
      }
      const resp = await this.mailService.sendMail(email);
      if (resp) {
        await this.updateStatus(emailId, 'sent');
      }
    } catch (err) {
      console.log('email job sending error: ', err);
      await this.updateStatus(emailId, 'failed');
      throw new InternalServerErrorException(err);
    }
    await this.updateStatus(emailId, 'sent');
  }

  // async readMail(){
  //     const connection = await this.connectToInbox();
  //     console.log(connection);
  //     // Define search criteria (e.g., all unseen emails)
  //     const searchCriteria = ['UNSEEN'];

  //     // Define the fetch options
  //     const fetchOptions = {
  //     bodies: ['HEADER', 'TEXT'],
  //     markSeen: true,
  //     };

  //     const results = await connection.search(searchCriteria, fetchOptions);
  //     const emails = results.map(res => ({
  //     subject: res.parts.filter(part => part.which === 'HEADER')[0].body.subject[0],
  //     from: res.parts.filter(part => part.which === 'HEADER')[0].body.from[0],
  //     text: res.parts.filter(part => part.which === 'TEXT')[0].body,
  //     }));

  //     // Close the connection after reading
  //     connection.end();

  //     return emails;
  // }
}
