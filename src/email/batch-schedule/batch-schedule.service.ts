import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
//import { BullQueueService } from 'src/email/bullqueue.service';
import * as XLSX from 'xlsx';
import { CreateMailDto } from '../email.dto';
import { EmailService } from '../email.service';
import { S3Service } from '../s3.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { isBoolean } from 'lodash';

const scheduleRequiredColumns = [
  'real_day',
  'real_time',
  'inject',
  'subject',
  'artefact_name',
  'email_groups',
  'additional_tos',
  'is_active',
] as const;

export type ScheduleSheetRow = Omit<
  Record<(typeof scheduleRequiredColumns)[number], string>,
  'is_active'
> & {
  ccs: string;
  bccs: string;
  real_day: number;
  is_active?: boolean; // either true, false or undefined (excel empty cell)
};

@Injectable()
export class BatchScheduleService {
  constructor(
    private readonly scheduleService: RedisService,
    private readonly emailService: EmailService,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  async getUploaded(project_id: number) {
    try {
      const bucket = this.configService.getOrThrow('S3_BUCKET_NAME');
      const uploadedFiles = await this.s3Service.getObjectsByPrefix(
        bucket,
        `${project_id}/artefact/batch`,
      );
      if (uploadedFiles) {
        return uploadedFiles;
      } else {
        return [];
      }
    } catch (err) {
      Logger.log(`Error getting uploaded files: ${err}`);
      throw new InternalServerErrorException(err);
    }
  }

  async removeFile(fileKey: string) {
    try {
      const bucket = this.configService.getOrThrow('S3_BUCKET_NAME');
      const key = fileKey;
      const result = await this.s3Service.DeleteObject(bucket, key);
      return result;
    } catch (err) {
      Logger.log('Error deleting object: ', err);
      throw new InternalServerErrorException(err);
    }
  }

  private getSheetHeaders(worksheet: XLSX.WorkSheet): string[] {
    const headers: string[] = [];
    if (!worksheet['!ref']) {
      throw new Error(
        'Sheet reference (!ref) is missing. The sheet might be empty.',
      );
    }
    const range = XLSX.utils.decode_range(worksheet['!ref']); // Get the data range
    //check if first row is empty
    const addr = XLSX.utils.encode_cell({ r: range.s.r, c: range.s.c });
    const cell = worksheet[addr];
    if (cell) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          headers.push(cell.v.toString().trim()); // Convert to string and trim spaces
        }
      }
    } else {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: range.s.r + 1,
          c: col,
        });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          headers.push(cell.v.toString().trim()); // Convert to string and trim spaces
        }
      }
    }
    return headers;
  }

  private getTodaySerial() {
    const excelEpoch = new Date(1899, 11, 30);
    const today = new Date();
    const diffInMilliseconds = today.getTime() - excelEpoch.getTime();
    const todayEpoch = Math.floor(diffInMilliseconds / 86400000);
    return todayEpoch;
  }

  private isValid24HourTime(value: any): boolean {
    if (typeof value !== 'string') return false; // Must be a string
    if (!/^\d{4}$/.test(value)) return false; // Must be exactly 4 digits
    const hours = parseInt(value.substring(0, 2), 10);
    const minutes = parseInt(value.substring(2, 4), 10);
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim()); // Trim spaces and test the regex
  }

  private excelSerialToDate(serial: number): Date {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel starts on 1899-12-30
    const msPerDay = 86400000; // 24 * 60 * 60 * 1000 (Milliseconds per day)
    return new Date(excelEpoch.getTime() + serial * msPerDay);
  }
  private combineDateAndTime(excelSerial: number, timeString: string): string {
    const date = this.excelSerialToDate(excelSerial); // Get the base date from Excel serial
    const hours = parseInt(timeString.substring(0, 2), 10);
    const minutes = parseInt(timeString.substring(2, 4), 10);
    date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds
    const utcDate = new Date(date.getTime() - 8 * 60 * 60 * 1000);
    return utcDate.toISOString(); // Return the combined date-time in ISO format
  }

  private convertPlainTextToHTML(text: string) {
    let htmlText = text.replace(/\r?\n/g, '<br>');
    htmlText = `<p>${htmlText}</p>`;
    return htmlText;
  }

  async processExcel(
    projectId: number,
    attachments: string[],
    filePath: string,
  ) {
    //const attachments : string[] = ["Artefacts/Capstone Application CGH - Machine learning model.pdf"]
    //const filePath = 'src/email/batch-schedule/test/testinguploadtemplate.xlsx';
    //const fileBuffer = fs.readFileSync(filePath)
    const bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');
    const fileBuffer = await this.s3Service.downloadFile(bucketName, filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const errors: string[] = [];
    // Check if "msel" exists in the workbook
    if (!workbook.SheetNames.includes('schedule')) {
      errors.push(
        "The uploaded Excel file must contain a sheet named 'schedule'.",
      );
      return { success: false, errors: errors };
    }
    const worksheet = workbook.Sheets['schedule'];
    try {
      const headers = this.getSheetHeaders(worksheet);
      const missingColumns = scheduleRequiredColumns.filter(
        (col) => !headers.includes(col),
      );
      if (missingColumns.length > 0) {
        errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
        return { success: false, errors: errors };
      }
      //parse and check for error
      //check if file exists and number of uploaded files matched number of attachments needed.
      const rows: ScheduleSheetRow[] = XLSX.utils.sheet_to_json(worksheet);
      const artefacts: string[] = rows
        .map((row: ScheduleSheetRow) => row['artefact_name']?.trim())
        .filter((artefact) => artefact && artefact !== '');
      if (artefacts.length != attachments.length) {
        errors.push(
          `Number of artefacts uploaded does not match the number of artefacts in file.${artefacts.length} artefacts expected. ${attachments.length} artefacts uploaded.`,
        );
      }

      const missingValues = artefacts.filter(
        (value) =>
          !attachments.some((attachment) => attachment.endsWith(value)),
      );
      if (missingValues.length > 0) {
        errors.push(
          `Missing files found in column 'artefact_name': ${missingValues.join(', ')}`,
        );
      }
      const additionalValues = attachments
        .filter(
          (attachment) =>
            !artefacts.some((artefact) => attachment.endsWith(artefact)),
        )
        .map((attachment) => {
          const parts = attachment.split('/');
          return parts[parts.length - 1]; // Get the last part (filename)
        });
      if (additionalValues.length > 0) {
        errors.push(
          `Additional files not found in column 'artefact_name': ${additionalValues.join(', ')}`,
        );
      }
      //check body not empty, subject not empty,
      //const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const subjectColumn: string[] = rows.map(
        (row: ScheduleSheetRow) => row['subject'] || '',
      );
      console.log(subjectColumn);
      let emptyFieldsWithRow = subjectColumn
        .map((value, index) => ({ value, row: index }))
        .filter((item) => !item.value || item.value.trim() === '');
      if (emptyFieldsWithRow.length > 0) {
        const emptyFieldsInfo = emptyFieldsWithRow
          .map((item) => `Row ${item.row}`)
          .join(', ');
        errors.push(
          `Empty fields found in column 'subject' at: ${emptyFieldsInfo}`,
        );
      }
      const bodyColumn: string[] = rows.map(
        (row: ScheduleSheetRow) => row['inject'] || '',
      );
      emptyFieldsWithRow = bodyColumn
        .map((value, index) => ({ value, row: index }))
        .filter((item) => !item.value || item.value.trim() === '');
      if (emptyFieldsWithRow.length > 0) {
        const emptyFieldsInfo = emptyFieldsWithRow
          .map((item) => `Row ${item.row}`)
          .join(', ');
        errors.push(
          `Empty fields found in column 'inject' at: ${emptyFieldsInfo}`,
        );
      }
      //check email groups or tos not empty
      const emptyTos = rows
        .slice(1)
        .map((row: ScheduleSheetRow, index) => ({
          row: index, // Account for header row (1-based index)
          colA: row['email_groups'],
          colB: row['additional_tos'],
        }))
        .filter(
          (item) =>
            (!item.colA || item.colA.trim() === '') &&
            (!item.colB || item.colB.trim() === ''),
        );
      if (emptyTos.length > 0) {
        const emptyRowsInfo = emptyTos
          .map((item) => `Row ${item.row}`)
          .join(', ');
        errors.push(
          `Both columns 'email_groups' and 'additional_tos' are empty at: ${emptyRowsInfo}`,
        );
      }
      //check date string correct
      const today = this.getTodaySerial();
      const dateRows = rows
        .map((row: ScheduleSheetRow, index) => ({
          value: row['real_day'],
          index: index,
        }))
        .filter((date) => date.value !== undefined);
      const nonDates = dateRows.filter(
        (value) =>
          typeof value.value !== 'number' ||
          value.value < today ||
          value.value > 2958465,
      );
      if (nonDates.length > 0) {
        const errorRows = nonDates.map((values) => values.index).join(', ');
        errors.push(
          `All values in 'real_day' column has to be either empty or a date. Dates also cannot be earlier than today. Errors on rows: ${errorRows}`,
        );
      }
      //check time string correct
      const timeRows = rows
        .map((row: ScheduleSheetRow, index) => ({
          value: row['real_time'],
          index: index,
        }))
        .filter((time) => time.value !== undefined);
      const nonTimes = timeRows.filter(
        (value) => !this.isValid24HourTime(value.value),
      );
      if (nonTimes.length > 0) {
        const errorRows = nonTimes.map((values) => values.index).join(', ');
        errors.push(
          `All values in 'real_time' column has to be either empty or a 24h time string (eg. '0930' or '1000'). Errors on rows: ${errorRows}`,
        );
      }
      //check email groups same as other tab
      if (workbook.SheetNames.includes('Email Groups')) {
        const groupsSheet = workbook.Sheets['Email Groups'];
        if (groupsSheet['!ref']) {
          interface EmailGroupRow {
            email_group: string;
            emails: string;
          }
          const emailGroupsRows: EmailGroupRow[] =
            XLSX.utils.sheet_to_json(groupsSheet);
          const emailGroups = emailGroupsRows.map(
            (row: EmailGroupRow) => row['email_group'],
          );
          //check valid emails for email_groups tab
          emailGroupsRows.forEach((row: EmailGroupRow, index) => {
            const value = row['emails'];
            if (value === undefined || value === '') {
              errors.push(
                `values in column 'emails' (in Email Groups sheet) cannot be empty. empty value at row ${index + 1}`,
              );
            } else {
              const emails = value.split(';').map((email) => email.trim()); // Split emails by ';' and trim spaces
              const invalidEmails = emails.filter(
                (email) => !this.isValidEmail(email),
              ); // Find invalid emails
              if (invalidEmails.length > 0) {
                errors.push(
                  `Invalid email(s) in column 'emails' (in Email Groups sheet) at row ${index + 1}: ${invalidEmails.join(', ')}`,
                );
              }
            }
          });
          rows.forEach((row, index) => {
            if (row.email_groups) {
              const groups = row.email_groups.split(';').map((g) => g.trim()); // Split and trim spaces
              groups.forEach((group) => {
                if (!emailGroups.includes(group)) {
                  errors.push(
                    `Invalid email group "${group}" found in row ${index}`,
                  );
                }
              });
            }
          });
          //check for email groups not in schedules sheet
          const allUsedGroups = new Set(
            rows.flatMap((row) =>
              row.email_groups
                ? row.email_groups.split(';').map((g) => g.trim())
                : [],
            ),
          );
          const missingGroups = emailGroups.filter(
            (group) => !allUsedGroups.has(group),
          );
          if (missingGroups.length > 0) {
            errors.push(
              `Missing expected email groups: ${missingGroups.join(', ')}`,
            );
          }
        }
      }
      //check valid emails
      rows.forEach((row: ScheduleSheetRow, index) => {
        const value = row['additional_tos'];
        if (value !== undefined && value !== '') {
          // Allow empty cells
          const emails = value.split(';').map((email) => email.trim()); // Split emails by ';' and trim spaces
          const invalidEmails = emails.filter(
            (email) => !this.isValidEmail(email),
          ); // Find invalid emails
          if (invalidEmails.length > 0) {
            errors.push(
              `Invalid email(s) in column 'additional_tos' at row ${index + 1}: ${invalidEmails.join(', ')}`,
            );
          }
        }
        const cc = row['ccs'];
        if (cc !== undefined && cc !== '') {
          // Allow empty cells
          const emails = cc.split(';').map((email) => email.trim()); // Split emails by ';' and trim spaces
          const invalidEmails = emails.filter(
            (email) => !this.isValidEmail(email),
          ); // Find invalid emails
          if (invalidEmails.length > 0) {
            errors.push(
              `Invalid email(s) in column 'ccs' at row ${index + 1}: ${invalidEmails.join(', ')}`,
            );
          }
        }
        const bcc = row['bccs'];
        if (bcc !== undefined && bcc !== '') {
          // Allow empty cells
          const emails = bcc.split(';').map((email) => email.trim()); // Split emails by ';' and trim spaces
          const invalidEmails = emails.filter(
            (email) => !this.isValidEmail(email),
          ); // Find invalid emails
          if (invalidEmails.length > 0) {
            errors.push(
              `Invalid email(s) in column 'bccs' at row ${index + 1}: ${invalidEmails.join(', ')}`,
            );
          }
        }
      });

      // check is_active states
      const activeStates = rows.map((r) => r.is_active);
      if (activeStates.some((s) => s !== undefined && !isBoolean(s))) {
        // some malformed cell values
        errors.push('is_active has to either be TRUE, FALSE or left empty');
      }

      if (errors.length > 0) {
        return { success: false, errors: errors };
      }
    } catch (error) {
      errors.push(error as string);
      console.log(error);
      return { success: false, errors: errors };
      //remove all uploaded files
    }

    //schedule emails
    const scheduled: { jobId: string | null; emailId: number }[] = []; // array of successfully scheduled jobs
    const rows: ScheduleSheetRow[] = XLSX.utils.sheet_to_json(worksheet);
    for (const value of rows) {
      let tos: string[] =
        value.additional_tos !== undefined && value.additional_tos !== ''
          ? value.additional_tos.split(';').map((email) => email.trim())
          : [];
      let ccs: string[] = [];
      let bccs: string[] = [];
      let datetimeString: string = '';
      if (value.email_groups !== undefined && value.email_groups !== '') {
        if (!workbook.SheetNames.includes('Email Groups')) {
          errors.push("Missing 'Email Groups' sheet");
          return { success: false, errors: errors };
        }
        const groups = value.email_groups
          .split(';')
          .map((group) => group.trim());
        const groupsSheet = workbook.Sheets['Email Groups'];
        if (!groupsSheet['!ref']) {
          errors.push("'Email Groups' sheet cannot be empty!");
          return { success: false, errors: errors };
        }
        interface EmailGroupRow {
          email_group: string;
          emails: string;
        }
        const emailGroupsRows: EmailGroupRow[] =
          XLSX.utils.sheet_to_json(groupsSheet);
        console.log('email group rows: ', emailGroupsRows);
        emailGroupsRows.forEach((row: EmailGroupRow) => {
          const value = row['email_group'];
          console.log(value);
          if (groups.includes(value)) {
            const emailAddresses = row['emails']
              .split(';')
              .map((addr) => addr.trim());
            tos = tos.concat(emailAddresses);
          }
        });
      }
      if (value['ccs'] !== undefined && value['ccs'] !== '') {
        ccs = value.ccs.split(';').map((cc) => cc.trim());
      }
      if (value['bccs'] !== undefined && value['bccs'] !== '') {
        bccs = value.bccs.split(';').map((bcc) => bcc.trim());
      }
      if (
        value.real_day !== undefined &&
        value.real_time !== undefined &&
        value.real_time !== ''
      ) {
        datetimeString = this.combineDateAndTime(
          value.real_day,
          value.real_time,
        );
      }
      const data: CreateMailDto = {
        project_id: projectId,
        to: tos,
        subject: value.subject,
        html: this.convertPlainTextToHTML(value.inject),
        attachments:
          value.artefact_name !== undefined && value.artefact_name !== ''
            ? [`${projectId}/artefact/batch/${value.artefact_name}`]
            : [],
        ...(datetimeString !== '' ? { scheduleDateTime: datetimeString } : {}),
        ...(ccs.length > 0 ? { cc: ccs } : {}),
        ...(bccs.length > 0 ? { bcc: bccs } : {}),
        ...(value.is_active !== undefined
          ? { is_active: value.is_active }
          : {}),
      };
      console.log('data: ', data);
      try {
        const resp = await this.scheduleService.createEmailSchedule(data);
        console.log('############### response ################\n', resp);
        scheduled.push({
          jobId: resp.resp.redis_job_id,
          emailId: resp.resp.id,
        });
      } catch (err: unknown) {
        console.log(err);
        if (err instanceof Error) {
          errors.push(err.message); // Access the message property safely
        } else {
          errors.push('An unknown error occurred'); // Handle non-Error cases
        }
        // remove jobs in queue nd emails in db
        for (const mail of scheduled) {
          if (mail.jobId !== null) {
            await this.scheduleService.removeJob(mail.jobId);
          }
          await this.emailService.deleteEmail(mail.emailId);
        }

        return { success: false, errors: errors };
      }
    }
    return { success: true, message: 'Emails scheduled successfully' };
  }
}
