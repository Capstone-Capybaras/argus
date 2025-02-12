import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface Attachments {
  filename: string;
  content: string;
  encoding: string;
  contentDisposition?: 'attachment' | 'inline' | undefined;
}
export interface RawEmail {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  attachments?: Attachments[];
  transport: string | SMTPTransport | SMTPTransport.Options;
}
